import "dotenv/config"
import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"

// Somnia Tokyo (Hideki) testnet, chain 50383
export const INDEXER_URL = "https://hideki-dev.smk.somnia.host/v1/graphql"
export const EXPLORER_URL = "https://explorer.testnet.somnia.network/tokyo"

export function connect(withSigner = true) {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}` | undefined
  if (withSigner && !privateKey) {
    throw new Error("PRIVATE_KEY missing. Run `npm run wallet` first.")
  }
  return new SomniaMarkets({
    chain: hidekiTestnet,
    indexerUrl: INDEXER_URL,
    addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
    privateKey: withSigner ? privateKey : undefined,
  })
}
