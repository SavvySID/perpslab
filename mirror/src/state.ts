import { appendFileSync } from "node:fs"
import type { Address } from "viem"

export interface Book {
  pool: Address
  symbol: string
  baseDecimals: number
  quoteDecimals: number
  leader: bigint
  follower: bigint
  leaderBase: bigint
  followerBase: bigint
  target: bigint
  mark: bigint | null
  status: string
  lastOrderAt: number
  backoffUntil: number
}

export interface Action {
  at: string
  symbol: string
  side: "buy" | "sell"
  quantity: string
  price: string
  dryRun: boolean
  ok: boolean
  hash?: string
  filled?: string
  reactionMs?: number
  note: string
}

const LOG_FILE = "mirror-log.jsonl"

export function createState() {
  const actions: Action[] = []
  return {
    books: new Map<Address, Book>(),
    actions,
    startedAt: new Date().toISOString(),
    ratioText: "",
    equity: { leader: 0n, follower: 0n },
    events: 0,
    lastEventAt: 0,
    record(a: Action) {
      actions.unshift(a)
      actions.length = Math.min(actions.length, 200)
      appendFileSync(LOG_FILE, JSON.stringify(a) + "\n")
    },
    ordersSince(ms: number) {
      return actions.filter((a) => !a.dryRun && a.hash && Date.parse(a.at) > Date.now() - ms).length
    },
  }
}

export type State = ReturnType<typeof createState>
