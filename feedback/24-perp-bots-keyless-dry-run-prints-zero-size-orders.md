# Keyless dry run of perp-maker / perp-starter "would place" 0-size orders
Severity: normal
Area: SDK

## Steps to reproduce
In dreamdex-bot-kit, no PRIVATE_KEY, a notional below the market minimum:
```
NETWORK=hideki PERP_SYMBOL=NEAR-PERP PERP_MM_NOTIONAL_USDSO=20 DRY_RUN=true npx tsx strategies/perp-maker/src/index.ts
```

## Expected
The same verdict as the keyed path: `skipped: size rounds below the market minimum (minQuantity …)`.

## Actual
```
perp-maker on NEAR-PERP | 20 USDso per side at 2x | ... | dry-run true
[dry-run] would place quote long 0 NEAR @ 4.6193
[dry-run] would place quote short 0 NEAR @ 4.6331
```
(20 USDso / 4.62 = 4.3 NEAR, below NEAR's minQuantity of 5.1.)

## Evidence
`sizeForNotional` → `alignQuantity` returns `0n` below `minQuantity` (`packages/perp-core/src/markets.ts:157-161`). Without a key the strategies skip `sizeOrder` and use `wanted` unchecked: `strategies/perp-maker/src/index.ts:160-162`, `strategies/perp-starter/src/index.ts:134-136`. `sizeOrder` is what rejects 0 (`packages/perp-core/src/orders.ts:105-110`).

## Environment
dreamdex-bot-kit @ 2579866 · Node 22.17 · Hideki testnet (50383) · checked 2026-10-26
