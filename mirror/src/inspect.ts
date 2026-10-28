import "dotenv/config"
import { formatUnits, getAddress, isAddress, type Address } from "viem"
import { parseRatio, type Ratio } from "./config.js"
import { capByNotional, planOrder } from "./sizing.js"
import { activePools, APP_URL, connect, loadVenue, markPrice, position, withRetry } from "./venue.js"

// Read-only look at a trader before you copy them: positions, activity, and what a copy would hold.
const arg = process.argv[2] ?? process.env.LEADER
if (!arg || !isAddress(arg)) {
  console.error("Usage: npm run inspect -- 0xTRADER   (set FOLLOWER and SCALE in .env for a copy preview)")
  process.exit(1)
}
const who = getAddress(arg)
const markets = connect()
const n = (x: bigint, d: number, digits = 4) => Number(formatUnits(x, d)).toLocaleString("en-US", { maximumFractionDigits: digits })

try {
  const venue = await loadVenue(markets)
  const acct = await activePools(markets, venue, who)
  console.log(`Trader ${who}\n${APP_URL}/trader/${who}?tab=positions`)
  console.log(`Equity ${n(acct.equity, 18, 2)} USDso, margin ${acct.status}, ${acct.pools.length} active markets\n`)

  const follower = process.env.FOLLOWER && isAddress(process.env.FOLLOWER) ? getAddress(process.env.FOLLOWER) : null
  let ratio: Ratio | null = null
  const scale = (process.env.SCALE ?? "auto").trim()
  if (follower) {
    const f = await activePools(markets, venue, follower)
    ratio = scale === "auto" ? (acct.equity > 0n ? { num: f.equity, den: acct.equity } : null) : parseRatio(scale)
    if (ratio) console.log(`Copy preview for ${follower} (equity ${n(f.equity, 18, 2)} USDso) at ${(Number(ratio.num) / Number(ratio.den)).toPrecision(3)}x:\n`)
  }
  const maxNotional = BigInt(process.env.MAX_NOTIONAL_USDSO ?? "250") * 10n ** 18n

  for (const pool of acct.pools) {
    const m = venue.byPool.get(pool as Address)
    if (!m) continue
    const p = await position(markets, venue, who, pool)
    if (p.size === 0n) continue
    const mark = (await markPrice(markets, pool)) ?? 0n
    const oneBase = 10n ** BigInt(m.baseDecimals)
    const abs = p.size < 0n ? -p.size : p.size
    const upnl = ((mark - p.avgEntryPrice) * p.size) / oneBase
    let line = `${(m.baseSymbol ?? "?").padEnd(9)} ${p.size < 0n ? "short" : "long "} ${n(abs, m.baseDecimals).padStart(14)}  notional ${n((abs * mark) / oneBase, m.quoteDecimals, 0).padStart(12)}  uPnL ${n(upnl, m.quoteDecimals, 2)}`
    if (ratio && mark > 0n) {
      const rules = { lotSize: BigInt(m.lotSize), minQuantity: BigInt(m.minQuantity), tickSize: BigInt(m.tickSize), oneBase }
      const target = capByNotional((p.size * ratio.num) / ratio.den, mark, maxNotional, rules)
      const plan = planOrder(target, 0n, rules)
      const why = target === 0n ? "too small at this scale" : plan
      line += typeof plan === "string" ? `   copy: none (${why})` : `   copy: ${n(plan.quantity, m.baseDecimals)}`
    }
    console.log(line)
  }

  const rows = await withRetry(() => markets.client.listPerpPositionChanges({ account: who.toLowerCase(), limit: 200, order: "desc" }))
  const now = Date.now() / 1000
  const day = rows.filter((r) => Number(r.timestamp) > now - 86_400)
  const realized = day.reduce((s, r) => s + r.realizedPnl, 0n)
  console.log(`\nActivity: ${day.length}${rows.length === 200 && day.length === 200 ? "+" : ""} position changes in the last 24 h, realized ${n(realized, 18, 2)} USDso`)
  if (rows[0]) console.log(`Last trade ${new Date(Number(rows[0].timestamp) * 1000).toISOString()}`)
  if (day.length >= 200) console.log("Trades this often look like a market maker: copying would send a stream of small orders.")
} finally {
  await markets.close()
}
