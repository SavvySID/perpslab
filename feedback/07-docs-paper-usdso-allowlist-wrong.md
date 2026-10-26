# Docs say Paper USDso can't open positions on 6 markets; on chain it can trade all 21
Severity: normal
Area: docs

## Steps to reproduce
1. Take an account whose margin is the Perps Arena credit (`getPerpVoucher` floor 1,000, no own deposit).
2. On ZRO, LIT, VVV, 1000PEPE, PUMP and ZEC (marked "No" in the docs), read `isVoucherMarketAllowed(pool)` on MarginBank `0x478769E1177C0773c43A593DCCc4Ad15F15F1394`, then `eth_call` a min-size `placeOrderFor` IOC buy and a resting bid for that account from its linked bot key.

## Expected
Per the docs: increases on those six markets revert (`VoucherMarketNotAllowed`), and `getMaxPerpOrderSize` reports `limitedBy: "voucherBlocked"`.

## Actual
Voucher account `0xf65EAcaE6AB6cA8a62d7B60Adde4946D3FFf25B8` (floor 1,000), bot `0x742558d9B28A55FEF29b9772D739C9DFAabf57ee`:
```
ZRO      block 33742895 allowed=true | IOC buy 5.1 -> OK | resting bid -> OK | max limitedBy initialMargin
LIT      block 33742936 allowed=true | IOC buy 2.8 -> OK | resting bid -> OK | max limitedBy initialMargin
VVV      block 33742982 allowed=true | IOC buy 0.44 -> OK | resting bid -> OK | max limitedBy initialMargin
1000PEPE block 33742999 allowed=true | IOC buy 2700 -> OK | resting bid -> OK | max limitedBy initialMargin
PUMP     block 33743038 allowed=true | IOC buy 1800 -> OK | resting bid -> OK | max limitedBy initialMargin
ZEC      block 33743064 allowed=true | IOC buy 0.009 -> OK | resting bid -> OK | max limitedBy initialMargin
```
`isVoucherMarketAllowed` is true on all 21 pools.

## Evidence
Wrong text:
- /docs/trading/perps-testnet: "Paper USDso" column = No for those six.
- /docs/trading/perps-testnet/margin-and-liquidations: "The six newest markets are not on that list."
- /docs/developers/perps-testnet: "Paper USDso blocks some markets."

## Environment
Hideki testnet (50383) · markets-sdk 0.32.1 · checked 2026-10-26
