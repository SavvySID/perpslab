import { contractErrorsAbi } from "@somnia-chain/markets-sdk"
import { BaseError, ContractFunctionRevertedError, createPublicClient, createWalletClient, http, parseAbi, zeroAddress, type Address, type Hex } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { CHAIN } from "./venue.js"

const IOC = 2
// Orders that sweep several levels have used over 16M gas on Hideki; unused gas is not billed.
const GAS = 20_000_000n
const GTC_EXPIRY_NS = (BigInt(Date.now()) + 365n * 86_400_000n) * 1_000_000n

const abi = [
  ...parseAbi([
    "function placeOrderFor(address owner, bool isBid, uint64 userData, uint256 price, uint256 quantity, uint64 expireTimestampNs, uint8 orderType, uint8 selfMatchingOption, address builder, uint96 builderFeeBpsTimes1k)",
  ]),
  ...contractErrorsAbi,
]

export function revertReason(err: unknown) {
  if (err instanceof BaseError) {
    const revert = err.walk((e) => e instanceof ContractFunctionRevertedError)
    if (revert instanceof ContractFunctionRevertedError) {
      return revert.data?.errorName ?? revert.signature ?? revert.shortMessage
    }
    return err.shortMessage
  }
  return String(err)
}

// The bot places IOC orders for the follower through its Link a Bot grant.
export function createExecutor(privateKey: Hex) {
  const account = privateKeyToAccount(privateKey)
  // Hideki confirms in ~100 ms; viem's default 4 s receipt polling would dominate reaction time.
  const publicClient = createPublicClient({ chain: CHAIN, transport: http(), pollingInterval: 250 })
  const wallet = createWalletClient({ account, chain: CHAIN, transport: http() })
  // One key, one transaction at a time: concurrent sends from two markets would reuse a nonce.
  let queue: Promise<unknown> = Promise.resolve()

  async function send(p: { pool: Address; owner: Address; isBid: boolean; price: bigint; quantity: bigint }) {
    const { request } = await publicClient.simulateContract({
      account,
      address: p.pool,
      abi,
      functionName: "placeOrderFor",
      args: [p.owner, p.isBid, 0n, p.price, p.quantity, GTC_EXPIRY_NS, IOC, 0, zeroAddress, 0n],
      gas: GAS,
    })
    const hash = await wallet.writeContract(request)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    return { hash, ok: receipt.status === "success", block: receipt.blockNumber }
  }

  return {
    publicClient,
    placeIoc(p: Parameters<typeof send>[0]) {
      const run = queue.then(() => send(p))
      queue = run.catch(() => {})
      return run
    },
  }
}
