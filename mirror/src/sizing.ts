import type { Ratio } from "./config.js"

// Sizes are signed raw base units (negative = short), prices raw quote per whole base.
export interface Rules {
  lotSize: bigint
  minQuantity: bigint
  tickSize: bigint
  oneBase: bigint
}

export interface Plan {
  isBid: boolean
  quantity: bigint
  closing: boolean
}

const abs = (x: bigint) => (x < 0n ? -x : x)
const sign = (x: bigint) => (x < 0n ? -1n : 1n)

export function alignToLot(size: bigint, lot: bigint) {
  return sign(size) * ((abs(size) / lot) * lot)
}

// The part of the leader's position held before copying started is never copied.
// When the leader reduces into it or crosses zero, that part shrinks with it, so a
// close of an old position doesn't open the opposite side for the follower.
export function shrinkBase(leader: bigint, base: bigint) {
  if (base === 0n || leader === 0n || sign(leader) !== sign(base)) return 0n
  return abs(leader) < abs(base) ? leader : base
}

// With baselines at zero this is plain proportional copying; with baselines set
// at start it copies only what the leader changes from then on.
export function copyTarget(p: { leader: bigint; leaderBase: bigint; followerBase: bigint; ratio: Ratio }) {
  return p.followerBase + ((p.leader - p.leaderBase) * p.ratio.num) / p.ratio.den
}

export function capByNotional(target: bigint, mark: bigint, maxNotional: bigint, rules: Rules) {
  const maxSize = alignToLot((maxNotional * rules.oneBase) / mark, rules.lotSize)
  return abs(target) > maxSize ? sign(target) * maxSize : target
}

// The order that moves the follower from `current` to `target`, or why there is none.
export function planOrder(target: bigint, current: bigint, rules: Rules): Plan | string {
  const closing = target === 0n && current !== 0n
  const diff = target - current
  const quantity = closing ? abs(current) : abs(alignToLot(diff, rules.lotSize))
  if (quantity === 0n) return "in sync"
  if (!closing && quantity < rules.minQuantity) return "change below market minimum"
  return { isBid: diff > 0n, quantity, closing }
}

// IOC limit that crosses the book: mark plus slippage for buys, minus for sells, on the tick.
export function crossingPrice(mark: bigint, isBid: boolean, slippageBps: bigint, tick: bigint) {
  if (isBid) {
    const p = (mark * (10_000n + slippageBps)) / 10_000n
    return ((p + tick - 1n) / tick) * tick
  }
  const p = (mark * (10_000n - slippageBps)) / 10_000n
  return (p / tick) * tick
}
