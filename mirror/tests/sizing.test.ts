import assert from "node:assert/strict"
import { test } from "node:test"
import { parseRatio } from "../src/config.js"
import { alignToLot, capByNotional, copyTarget, crossingPrice, planOrder, shrinkBase } from "../src/sizing.js"

// BTC-like market: 8 base decimals, lot 1000, min 13000, tick 0.1 USDso
const rules = { lotSize: 1000n, minQuantity: 13_000n, tickSize: 10n ** 17n, oneBase: 10n ** 8n }
const half = parseRatio("0.5")

test("parseRatio keeps decimals exact", () => {
  assert.deepEqual(parseRatio("0.05"), { num: 5n, den: 100n })
  assert.deepEqual(parseRatio("2"), { num: 2n, den: 1n })
  assert.throws(() => parseRatio("0"))
  assert.throws(() => parseRatio("-1"))
})

test("alignToLot rounds toward zero on both sides", () => {
  assert.equal(alignToLot(12_999n, 1000n), 12_000n)
  assert.equal(alignToLot(-12_999n, 1000n), -12_000n)
})

test("copyTarget copies only changes after start", () => {
  assert.equal(copyTarget({ leader: 100_000n, leaderBase: 0n, followerBase: 0n, ratio: half }), 50_000n)
  assert.equal(copyTarget({ leader: 150_000n, leaderBase: 100_000n, followerBase: 7_000n, ratio: half }), 32_000n)
  assert.equal(copyTarget({ leader: -40_000n, leaderBase: 0n, followerBase: 0n, ratio: half }), -20_000n)
})

test("shrinkBase: closing a pre-existing position never opens the opposite side", () => {
  // leader held 100k before start, adds 50k, then reduces to 80k, then closes
  let base = 100_000n
  base = shrinkBase(150_000n, base)
  assert.equal(copyTarget({ leader: 150_000n, leaderBase: base, followerBase: 0n, ratio: half }), 25_000n)
  base = shrinkBase(80_000n, base)
  assert.equal(base, 80_000n)
  assert.equal(copyTarget({ leader: 80_000n, leaderBase: base, followerBase: 0n, ratio: half }), 0n)
  base = shrinkBase(0n, base)
  assert.equal(copyTarget({ leader: 0n, leaderBase: base, followerBase: 0n, ratio: half }), 0n)
  // a flip is a fresh position and is copied
  base = shrinkBase(-60_000n, 100_000n)
  assert.equal(copyTarget({ leader: -60_000n, leaderBase: base, followerBase: 0n, ratio: half }), -30_000n)
})

test("capByNotional clamps size to the per-market budget", () => {
  const mark = 80_000n * 10n ** 18n // 80,000 USDso per BTC
  const max = 250n * 10n ** 18n // 250 USDso
  assert.equal(capByNotional(1_000_000n, mark, max, rules), 312_000n) // 0.00312 BTC
  assert.equal(capByNotional(-1_000_000n, mark, max, rules), -312_000n)
  assert.equal(capByNotional(100_000n, mark, max, rules), 100_000n)
})

test("planOrder sizes the move and respects the market minimum", () => {
  assert.deepEqual(planOrder(50_000n, 0n, rules), { isBid: true, quantity: 50_000n, closing: false })
  assert.deepEqual(planOrder(-20_000n, 10_000n, rules), { isBid: false, quantity: 30_000n, closing: false })
  assert.equal(planOrder(55_000n, 50_000n, rules), "change below market minimum")
  assert.equal(planOrder(50_000n, 50_000n, rules), "in sync")
  // a full close goes through even below the minimum
  assert.deepEqual(planOrder(0n, 5_000n, rules), { isBid: false, quantity: 5_000n, closing: true })
})

test("crossingPrice lands on the tick, past the mark", () => {
  const mark = 80_000n * 10n ** 18n + 3n * 10n ** 16n // 80,000.03
  const buy = crossingPrice(mark, true, 100n, rules.tickSize)
  const sell = crossingPrice(mark, false, 100n, rules.tickSize)
  assert.equal(buy % rules.tickSize, 0n)
  assert.equal(sell % rules.tickSize, 0n)
  assert.ok(buy >= (mark * 10_100n) / 10_000n)
  assert.ok(sell <= (mark * 9_900n) / 10_000n)
})
