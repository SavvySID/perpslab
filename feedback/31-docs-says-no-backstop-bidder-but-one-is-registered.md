# Docs say no backstop bidder is registered on testnet; one is, and it has taken over positions
Severity: normal
Area: docs

## Steps to reproduce
Read LiquidationEngine `0xA66d3C24Ad4a389d863846905D8173e1017e9F4D` (address from /docs/developers/perps-testnet): `getBidderCount()`, `getBidders()`. Then look at tx `0xeed95612916a94094a3791bcae20eccf0f729d606c70094394704eeaf99ab431`.

## Expected
Per /docs/trading/perps-testnet/margin-and-liquidations: "No backstop bidders are registered on testnet, so the later stages come in sooner."

## Actual
```
getBidderCount() = 1
getBidders()     = [0xAF327764345c2f54C1F2bc3322D28E4f633793b9]
tx 0xeed956… (block 28535489, 2026-10-20T14:10:40Z, success):
  PositionLiquidated  account 0xc01592F1…0D94 pool ETH-PERP
  PositionTakenOver   account 0xc01592F1…0D94 bidder 0xAF327764…93b9 size -32.429 ETH takeoverPrice 2510.20
```
The indexer has 3 `PositionTakenOver` events (2026-10-20, 14:10–14:14 UTC).

## Evidence
Chain reads and receipt above. Liquidations reach the backstop stage, so the docs' description of the escalation on testnet is wrong.

## Environment
Hideki testnet (50383) · checked 2026-10-26
