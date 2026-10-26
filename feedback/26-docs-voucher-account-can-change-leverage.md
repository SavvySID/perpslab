# Docs say a paper-USDso account can't change its leverage setting; MarginBank accepts the change
Severity: normal
Area: docs

## Steps to reproduce
From an account holding the Perps Arena credit (`getCreditFloor` = 1,000), `debug_traceCall` (or send) `MarginBank.setMaxLeverage(pool, 3)` on MarginBank `0x478769E1177C0773c43A593DCCc4Ad15F15F1394`.

## Expected
Per the docs it's rejected (the SDK error ABI even has `VoucherAccountLeverageLocked`).

## Actual
Account `0xf65EAcaE6AB6cA8a62d7B60Adde4946D3FFf25B8` (credit floor 1,000, open SOL position), block 33755915:
```
setMaxLeverage(ETH-PERP, 3): no error | gasUsed 266605
log MarginBank MaxLeverageSet {"account":"0xf65E…25B8","perpPool":"0xD6Cb…eddf","leverageX":3}
MarginBank storage 0xeadc974f…e44e : 0x…00 -> 0x…03
```
`eth_call` of `setMaxLeverage` with 3x and 10x also succeeds on ETH, BTC and SOL. SOL is the market the account holds a position in.

## Evidence
Wrong text:
- /docs/trading/perps-testnet/margin-and-liquidations (Paper USDso): "Your leverage setting can't be changed while it remains."
- SDK `docs/PERPS.md:839-840`: "the account cannot change its own leverage setting."

The live voucher leverage cap is 20 (`getVoucherLeverageCap`), and 20x is already every market's maximum, so a voucher account can set any leverage a normal account can. Either the docs are wrong, or the intended lock isn't enforced.

## Environment
Hideki testnet (50383) · markets-sdk 0.32.1 · checked 2026-10-26 (simulation only, nothing sent)
