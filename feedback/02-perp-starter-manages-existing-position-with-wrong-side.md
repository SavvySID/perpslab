# perp-starter manages an existing position using PERP_SIDE, not the position's side
Severity: major
Area: SDK

## Steps to reproduce
1. Hold a short on ETH-PERP in the account.
2. `NETWORK=hideki PERP_SYMBOL=ETH-PERP OWNER_ADDRESS=<that account> DRY_RUN=true npm start -w perp-starter` (default PERP_SIDE=long)

## Expected
Exit levels for the held short (TP below mark, SL above), or refuse to start when PERP_SIDE disagrees with the position.

## Actual
```
already short 2.2873 ETH, managing it instead of opening another
[dry-run] would watch take-profit 2444.04 and stop-loss 2372.15
```
Long-side levels on a short: it would close the short after a 2% adverse move as "take-profit".

## Evidence
`strategies/perp-starter/src/index.ts`: `existing` is detected at `:121-123`, but levels (`:176-177`), `armBracket({ position: SIDE })` (`:187`) and watched-exit checks (`:224-225`) all use `SIDE`.

## Environment
dreamdex-bot-kit @ 2579866 (markets-sdk 0.31.0) · Node 22.17 · Hideki testnet (50383)
