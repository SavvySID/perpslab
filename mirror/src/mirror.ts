import { marginBankEventsAbi } from "@somnia-chain/markets-sdk"
import { createReactivity, unwrap } from "@somnia-chain/markets-sdk/reactivity"
import { decodeEventLog, encodeEventTopics, formatUnits, getAbiItem, getAddress, pad, type Address } from "viem"
import { loadConfig, type Ratio } from "./config.js"
import { startDashboard } from "./dashboard.js"
import { createExecutor, revertReason } from "./executor.js"
import { capByNotional, copyTarget, crossingPrice, planOrder, shrinkBase, type Rules } from "./sizing.js"
import { createState, type Book } from "./state.js"
import { activePools, connect, EXPLORER_URL, loadVenue, markPrice, positionSize } from "./venue.js"

const DEBOUNCE_MS = 250
const COOLDOWN_MS = 1_500
const BACKOFF_MS = 60_000

const cfg = loadConfig()
const markets = connect(cfg.privateKey)
const venue = await loadVenue(markets)
const executor = createExecutor(cfg.privateKey)
const state = createState()
const bot = markets.walletAddress!

const fmt = (raw: bigint, decimals: number) => formatUnits(raw, decimals)
const allowed = (pool: Address) => !cfg.markets || cfg.markets.includes(venue.symbol(pool).toUpperCase())

function rules(pool: Address): Rules {
  const m = venue.byPool.get(pool)!
  return {
    lotSize: BigInt(m.lotSize),
    minQuantity: BigInt(m.minQuantity),
    tickSize: BigInt(m.tickSize),
    oneBase: 10n ** BigInt(m.baseDecimals),
  }
}

async function resolveRatio(): Promise<Ratio> {
  const [leader, follower] = await Promise.all([
    activePools(markets, venue, cfg.leader),
    activePools(markets, venue, cfg.follower),
  ])
  state.equity = { leader: leader.equity, follower: follower.equity }
  if (cfg.scale !== "auto") {
    state.ratioText = `${Number(cfg.scale.num) / Number(cfg.scale.den)}x leader size`
    return cfg.scale
  }
  if (leader.equity <= 0n) throw new Error("Leader has no equity, so SCALE=auto has nothing to scale by. Set SCALE.")
  state.ratioText = `auto: ${(Number(follower.equity) / Number(leader.equity)).toPrecision(3)}x (equity ratio)`
  return { num: follower.equity, den: leader.equity }
}

const ratio = await resolveRatio()

const pendingBooks = new Map<Address, Promise<Book>>()

function ensureBook(pool: Address, atStart: boolean): Promise<Book> {
  const existing = state.books.get(pool)
  if (existing) return Promise.resolve(existing)
  let pending = pendingBooks.get(pool)
  if (!pending) {
    pending = createBook(pool, atStart).finally(() => pendingBooks.delete(pool))
    pendingBooks.set(pool, pending)
  }
  return pending
}

async function createBook(pool: Address, atStart: boolean): Promise<Book> {
  const m = venue.byPool.get(pool)!
  const [leader, follower] = await Promise.all([
    positionSize(markets, venue, cfg.leader, pool),
    positionSize(markets, venue, cfg.follower, pool),
  ])
  // Without COPY_EXISTING, positions the leader already held at start are left alone.
  const book: Book = {
    pool,
    symbol: m.baseSymbol ?? pool,
    baseDecimals: m.baseDecimals,
    quoteDecimals: m.quoteDecimals,
    leader,
    follower,
    leaderBase: cfg.copyExisting || !atStart ? 0n : leader,
    followerBase: cfg.copyExisting ? 0n : follower,
    target: follower,
    mark: null,
    status: "watching",
    lastOrderAt: 0,
    backoffUntil: 0,
  }
  state.books.set(pool, book)
  return book
}

// One reconcile per market at a time; extra triggers while one runs collapse into the next pass.
const running = new Map<Address, Promise<void>>()
const timers = new Map<Address, NodeJS.Timeout>()

function schedule(pool: Address, triggeredAt: number | null, delay = DEBOUNCE_MS) {
  clearTimeout(timers.get(pool))
  timers.set(
    pool,
    setTimeout(() => {
      const prev = running.get(pool) ?? Promise.resolve()
      running.set(pool, prev.then(() => reconcile(pool, triggeredAt)).catch((err) => console.error(err)))
    }, delay),
  )
}

const lastDryPlan = new Map<Address, string>()

async function reconcile(pool: Address, triggeredAt: number | null) {
  const book = state.books.get(pool)
  if (!book || Date.now() < book.backoffUntil) return
  const r = rules(pool)

  book.mark = await markPrice(markets, pool)
  if (book.mark === null) {
    book.status = "no live mark price"
    return
  }
  book.follower = await positionSize(markets, venue, cfg.follower, pool)
  book.leaderBase = shrinkBase(book.leader, book.leaderBase)
  const maxNotional = cfg.maxNotionalUsdso * 10n ** BigInt(book.quoteDecimals)
  book.target = capByNotional(copyTarget({ ...book, ratio }), book.mark, maxNotional, r)

  const plan = planOrder(book.target, book.follower, r)
  if (typeof plan === "string") {
    book.status = plan
    lastDryPlan.delete(pool)
    return
  }

  const reducing = plan.closing || (plan.isBid ? book.follower < 0n : book.follower > 0n)
  if (!reducing && state.ordersSince(3_600_000) >= cfg.maxOrdersPerHour) {
    book.status = "hourly order cap reached"
    return
  }
  const wait = book.lastOrderAt + COOLDOWN_MS - Date.now()
  if (wait > 0) return schedule(pool, triggeredAt, wait)

  const price = crossingPrice(book.mark, plan.isBid, cfg.slippageBps, r.tickSize)
  // Size at the price actually sent, not the touch, or a clamped order can still revert.
  const max = await markets.client.getMaxPerpOrderSize({
    pool,
    marginBank: venue.marginBank,
    account: cfg.follower,
    isBid: plan.isBid,
    price,
  })
  if (!max.priceable) {
    book.status = "no live price to size the copy"
    return
  }
  const cap = (max.maxQuantity / r.lotSize) * r.lotSize
  const quantity = plan.quantity > cap ? cap : plan.quantity
  if (quantity === 0n || (!plan.closing && quantity < r.minQuantity)) {
    book.status = `can't size the copy: limited by ${max.limitedBy}`
    return
  }

  const side = plan.isBid ? "buy" : "sell"
  const base = {
    symbol: book.symbol,
    side,
    quantity: fmt(quantity, book.baseDecimals),
    price: fmt(price, book.quoteDecimals),
  } as const

  if (cfg.dryRun) {
    const key = `${side}:${quantity}`
    book.status = `dry run: would ${side} ${base.quantity}`
    if (lastDryPlan.get(pool) !== key) {
      lastDryPlan.set(pool, key)
      state.record({ ...base, at: new Date().toISOString(), dryRun: true, ok: true, note: "dry run, nothing sent" })
    }
    return
  }

  book.lastOrderAt = Date.now()
  const before = book.follower
  try {
    const res = await executor.placeIoc({ pool, owner: cfg.follower, isBid: plan.isBid, price, quantity })
    const confirmedAt = Date.now()
    book.follower = await positionSize(markets, venue, cfg.follower, pool)
    const filled = book.follower - before
    state.record({
      ...base,
      at: new Date().toISOString(),
      dryRun: false,
      ok: res.ok,
      hash: res.hash,
      filled: fmt(filled < 0n ? -filled : filled, book.baseDecimals),
      reactionMs: triggeredAt ? confirmedAt - triggeredAt : undefined,
      note: res.ok ? (filled === 0n ? "no fill within slippage" : "copied") : "reverted",
    })
    book.status = filled === 0n ? "no fill within slippage, retrying next sync" : "in sync"
    console.log(`${side} ${base.quantity} ${book.symbol} @ ${base.price}: ${EXPLORER_URL}/tx/${res.hash}`)
  } catch (err) {
    const reason = revertReason(err)
    book.backoffUntil = Date.now() + BACKOFF_MS
    book.status = `order failed (${reason}), retrying in 60 s`
    state.record({ ...base, at: new Date().toISOString(), dryRun: false, ok: false, note: reason })
    console.error(`${side} ${book.symbol} failed: ${reason}`)
  }
}

// Every PositionUpdated for the leader, pushed by Somnia Reactivity as it lands.
const positionUpdated = getAbiItem({ abi: marginBankEventsAbi, name: "PositionUpdated" })
const [topic0] = encodeEventTopics({ abi: [positionUpdated], eventName: "PositionUpdated" })

async function watchLeader() {
  const sub = unwrap(
    await createReactivity(markets.client).watch({
      eventContractSources: [venue.marginBank],
      topicOverrides: [topic0, pad(cfg.leader)],
      ethCalls: [],
      onData: (note: any) => {
        const receivedAt = Date.now()
        const { args } = decodeEventLog({ abi: [positionUpdated], data: note.result.data, topics: note.result.topics })
        const pool = getAddress((args as { perpPool: Address }).perpPool)
        if (!allowed(pool) || !venue.byPool.has(pool)) return
        state.events++
        state.lastEventAt = receivedAt
        ensureBook(pool, false)
          .then((book) => {
            book.leader = (args as { newSize: bigint }).newSize
            schedule(pool, receivedAt)
          })
          .catch((err) => console.error(err))
      },
    }),
  )
  return sub
}

// Periodic full pass: catches anything a dropped subscription missed and refreshes equity.
async function sync() {
  const [leader, follower] = await Promise.all([
    activePools(markets, venue, cfg.leader),
    activePools(markets, venue, cfg.follower),
  ])
  state.equity = { leader: leader.equity, follower: follower.equity }
  const pools = new Set([...leader.pools, ...state.books.keys()].filter(allowed))
  for (const pool of pools) {
    const book = await ensureBook(pool, false)
    book.leader = await positionSize(markets, venue, cfg.leader, pool)
    schedule(pool, null)
  }
}

async function start() {
  console.log(`Mirror: copying ${cfg.leader} into ${cfg.follower} (bot ${bot})`)
  console.log(`Scale ${state.ratioText}, max ${cfg.maxNotionalUsdso} USDso per market, ${cfg.dryRun ? "DRY RUN" : "LIVE"}`)
  const { pools } = await activePools(markets, venue, cfg.leader)
  for (const pool of pools.filter(allowed)) await ensureBook(pool, true)
  const sub = await watchLeader()
  startDashboard(cfg, state, bot)
  if (cfg.copyExisting) for (const pool of state.books.keys()) schedule(pool, null)
  const timer = setInterval(() => sync().catch((err) => console.error("sync:", err)), cfg.reconcileSec * 1000)

  const stop = async () => {
    clearInterval(timer)
    await sub.unsubscribe().catch(() => {})
    await markets.close()
    process.exit(0)
  }
  process.on("SIGINT", stop)
  process.on("SIGTERM", stop)
}

await start()
