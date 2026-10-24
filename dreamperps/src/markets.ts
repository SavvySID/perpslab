import { formatUnits } from "viem"
import { connect } from "./config.js"

// Read-only: lists the perp markets on Somnia Tokyo testnet.
const markets = connect(false)

try {
  const perps = await markets.client.listPerpMarkets()
  for (const m of perps) {
    const mark = m.markPrice ? formatUnits(BigInt(m.markPrice), m.quoteDecimals) : "n/a"
    console.log(`${m.baseSymbol}/${m.quoteSymbol}  pool=${m.poolAddress}  mark=${mark}  maxLev=${10_000 / m.initialMarginBps}x`)
  }
} finally {
  await markets.close()
}
