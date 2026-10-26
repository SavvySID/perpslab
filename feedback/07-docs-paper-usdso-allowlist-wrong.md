# Docs say Paper USDso is blocked on 6 markets; all 21 are allowed on chain
Severity: normal
Area: docs

## Steps to reproduce
For each pool from `client.listPerpMarkets()`, read `isVoucherMarketAllowed(pool)` on MarginBank `0x478769E1177C0773c43A593DCCc4Ad15F15F1394`.

## Expected
Per the docs: false for ZRO, LIT, VVV, 1000PEPE, PUMP, ZEC.

## Actual
`true` for all 21 pools. `getMaxPerpOrderSize` for a voucher account never returns `limitedBy: "voucherBlocked"` on those markets.

## Evidence
Wrong text:
- /docs/trading/perps-testnet: "Paper USDso" column = No for those six.
- /docs/trading/perps-testnet/margin-and-liquidations: "The six newest markets are not on that list."
- /docs/developers/perps-testnet: "Paper USDso blocks some markets."

## Environment
Hideki testnet (50383) · markets-sdk 0.32.1 · checked 2026-10-24
