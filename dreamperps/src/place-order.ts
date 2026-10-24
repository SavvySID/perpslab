import { appendFileSync, existsSync, writeFileSync } from "node:fs"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
import { createPublicClient, createWalletClient, formatEther, formatUnits, http, parseAbi, parseEther, zeroAddress } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { connect, EXPLORER_URL } from "./config.js"

// Rests a small limit buy 5% under mark on a dreamDEX perp market.
// With OWNER set, the bot trades that wallet's perps account through the
// Link a Bot operator grant (placeOrderFor). Without it, the bot trades its
// own account and first tries to claim the paper USDso voucher.
const SYMBOL = (process.env.MARKET ?? "BTC").toUpperCase()
const OWNER = process.env.OWNER as `0x${string}` | undefined
const MIN_GAS_BALANCE = parseEther("0.6") // SDK default gas ceiling x fee ceiling
const GAS = 10_000_000n
const GTC_EXPIRY_NS = (BigInt(Date.now()) + 50n * 365n * 86_400_000n) * 1_000_000n

const perpPoolOperatorAbi = parseAbi([
  "function placeOrderFor(address owner, bool isBid, uint64 userData, uint256 price, uint256 quantity, uint64 expireTimestampNs, uint8 orderType, uint8 selfMatchingOption, address builder, uint96 builderFeeBpsTimes1k)",
])

const markets = connect()
const bot = markets.walletAddress!
const account = OWNER ?? bot

function logProof(label: string, hash: string) {
  if (!existsSync("PROOF.md")) writeFileSync("PROOF.md", "# Somnia Tokyo testnet transactions\n\n")
  appendFileSync("PROOF.md", `- ${new Date().toISOString()} ${label}: \`${hash}\`\n`)
}

try {
  console.log(`Bot: ${bot}`)
  if (OWNER) console.log(`Trading for: ${OWNER}`)

  const stt = await markets.client.getNativeBalance(bot)
  console.log(`STT balance: ${formatEther(stt)}`)
  if (stt < MIN_GAS_BALANCE) {
    throw new Error("Need at least 0.6 STT for gas. Link this address in the dreamDEX app (Link a bot) and send it gas.")
  }

  const perps = await markets.client.listPerpMarkets()
  const market = perps.find((m) => m.baseSymbol === SYMBOL || m.baseSymbol === `W${SYMBOL}`)
  if (!market) {
    throw new Error(`No ${SYMBOL} perp market. Available: ${perps.map((m) => m.baseSymbol).join(", ")}`)
  }
  console.log(`Market: ${market.baseSymbol}/${market.quoteSymbol} pool ${market.poolAddress}`)

  if (!OWNER) {
    const eligibility = await markets.client.getPerpVoucherEligibility(market.marginBank, bot)
    if (eligibility.eligible) {
      try {
        const claim = await markets.trader.claimPerpVoucher({ marginBank: market.marginBank })
        console.log(`Voucher claimed (${formatUnits(eligibility.grantAmount, market.quoteDecimals)} USDso): ${claim.hash}`)
        logProof("claimPerpVoucher", claim.hash)
      } catch (err) {
        console.log(`Voucher claim reverted: ${(err as { data?: string }).data ?? err}`)
      }
    } else {
      console.log(`Voucher not claimable: ${eligibility.reason}`)
    }
  }

  const state = await markets.client.getPerpState(market.poolAddress)
  if (!state.markPriceOk) throw new Error("Mark price feed is stale, try again later.")

  const tick = BigInt(market.tickSize)
  const lot = BigInt(market.lotSize)
  const price = ((state.markPrice * 95n) / 100n / tick) * tick
  const minQty = BigInt(market.minQuantity)
  const quantity = ((minQty + lot - 1n) / lot) * lot

  const max = await markets.client.getMaxPerpOrderSize({
    pool: market.poolAddress,
    marginBank: market.marginBank,
    account,
    isBid: true,
    price,
  })
  if (!max.priceable) throw new Error("No live mark price to size against.")
  if (!max.placeable || quantity > max.maxQuantity) {
    throw new Error(`Order not placeable, limited by ${max.limitedBy}`)
  }

  console.log(
    `Placing limit buy ${formatUnits(quantity, market.baseDecimals)} ${market.baseSymbol} @ ${formatUnits(price, market.quoteDecimals)}`,
  )

  let hash: `0x${string}`
  if (OWNER) {
    const publicClient = createPublicClient({ chain: hidekiTestnet, transport: http() })
    const wallet = createWalletClient({
      account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
      chain: hidekiTestnet,
      transport: http(),
    })
    const { request } = await publicClient.simulateContract({
      account: wallet.account,
      address: market.poolAddress,
      abi: perpPoolOperatorAbi,
      functionName: "placeOrderFor",
      args: [OWNER, true, 0n, price, quantity, GTC_EXPIRY_NS, 0, 0, zeroAddress, 0n],
      gas: GAS,
    })
    hash = await wallet.writeContract(request)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    if (receipt.status !== "success") throw new Error(`placeOrderFor reverted: ${hash}`)
  } else {
    const order = await markets.trader.placePerpOrder({ pool: market.poolAddress, isBid: true, price, quantity })
    console.log(`Order id: ${order.orderId ?? "filled, did not rest"}  fills: ${order.fills.length}`)
    hash = order.hash
  }

  console.log(`Order tx: ${hash}`)
  console.log(`Explorer: ${EXPLORER_URL}/tx/${hash}`)
  logProof(`placePerpOrder ${market.baseSymbol}${OWNER ? ` for ${OWNER}` : ""}`, hash)
} finally {
  await markets.close()
}
