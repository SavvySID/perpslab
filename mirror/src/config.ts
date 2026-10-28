import "dotenv/config"
import { getAddress, isAddress, type Address, type Hex } from "viem"

export interface Ratio {
  num: bigint
  den: bigint
}

export interface Config {
  privateKey: Hex
  leader: Address
  follower: Address
  scale: Ratio | "auto"
  copyExisting: boolean
  maxNotionalUsdso: bigint
  slippageBps: bigint
  markets: string[] | null
  reconcileSec: number
  maxOrdersPerHour: number
  dryRun: boolean
  port: number
}

function address(name: string): Address {
  const v = process.env[name]
  if (!v || !isAddress(v)) throw new Error(`${name} must be a 0x address`)
  return getAddress(v)
}

// "0.05" -> 5/100, so sizes stay exact bigint math.
export function parseRatio(text: string): Ratio {
  if (!/^\d+(\.\d+)?$/.test(text)) throw new Error(`SCALE must be a positive decimal or "auto", got ${text}`)
  const [whole, frac = ""] = text.split(".")
  const den = 10n ** BigInt(frac.length)
  const num = BigInt(whole + frac)
  if (num === 0n) throw new Error("SCALE must be above 0")
  return { num, den }
}

function flag(name: string, fallback: boolean) {
  const v = process.env[name]?.trim().toLowerCase()
  if (v === undefined || v === "") return fallback
  return v === "true" || v === "1" || v === "yes"
}

export function loadConfig(): Config {
  const privateKey = process.env.PRIVATE_KEY as Hex | undefined
  if (!privateKey) throw new Error("PRIVATE_KEY missing: the bot key you linked in the dreamDEX app")
  const scale = (process.env.SCALE ?? "auto").trim()
  const markets = process.env.MARKETS?.trim()
  return {
    privateKey,
    leader: address("LEADER"),
    follower: address("FOLLOWER"),
    scale: scale === "auto" ? "auto" : parseRatio(scale),
    copyExisting: flag("COPY_EXISTING", false),
    maxNotionalUsdso: BigInt(process.env.MAX_NOTIONAL_USDSO ?? "250"),
    slippageBps: BigInt(process.env.SLIPPAGE_BPS ?? "100"),
    markets: markets ? markets.split(",").map((s) => s.trim().toUpperCase()) : null,
    reconcileSec: Number(process.env.RECONCILE_SEC ?? "20"),
    maxOrdersPerHour: Number(process.env.MAX_ORDERS_PER_HOUR ?? "60"),
    dryRun: flag("DRY_RUN", true),
    port: Number(process.env.PORT ?? "8787"),
  }
}
