import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets, type PerpMarket } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
import { getAddress, type Address, type Hex } from "viem"

// Somnia Tokyo (Hideki) testnet, chain 50383
export const CHAIN = hidekiTestnet
export const INDEXER_URL = "https://hideki-dev.smk.somnia.host/v1/graphql"
export const EXPLORER_URL = "https://explorer.testnet.somnia.network/tokyo"
export const APP_URL = "https://app.testnet.dreamdex.io"

export function connect(privateKey?: Hex) {
  return new SomniaMarkets({
    chain: CHAIN,
    indexerUrl: INDEXER_URL,
    addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
    privateKey,
  })
}

export type Venue = Awaited<ReturnType<typeof loadVenue>>

// One market table keyed by checksummed pool address, plus the shared MarginBank.
export async function loadVenue(markets: SomniaMarkets) {
  const rows = await markets.client.listPerpMarkets()
  const byPool = new Map<Address, PerpMarket>()
  for (const m of rows) byPool.set(getAddress(m.poolAddress), m)
  const marginBank = getAddress(rows[0].marginBank)
  return {
    marginBank,
    byPool,
    symbol: (pool: Address) => byPool.get(getAddress(pool))?.baseSymbol ?? pool,
    bySymbol: (symbol: string) => rows.find((m) => m.baseSymbol?.toUpperCase() === symbol.toUpperCase()),
  }
}

// The testnet RPC occasionally times out a read; try a couple more times before giving up.
export async function withRetry<T>(read: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await read()
    } catch (err) {
      if (i >= attempts) throw err
      await new Promise((r) => setTimeout(r, 500 * i))
    }
  }
}

export async function position(markets: SomniaMarkets, venue: Venue, account: Address, pool: Address) {
  return withRetry(() => markets.client.getPerpPosition({ marginBank: venue.marginBank, account, pool }))
}

export async function positionSize(markets: SomniaMarkets, venue: Venue, account: Address, pool: Address) {
  return (await position(markets, venue, account, pool)).size
}

export async function markPrice(markets: SomniaMarkets, pool: Address) {
  const s = await withRetry(() => markets.client.getPerpState(pool))
  return s.markPriceOk ? s.markPrice : null
}

export async function activePools(markets: SomniaMarkets, venue: Venue, account: Address) {
  const a = await withRetry(() => markets.client.getMarginAccount(venue.marginBank, account))
  return { pools: a.activePerpPools.map((p) => getAddress(p)), equity: a.equity, status: a.marginStatus }
}
