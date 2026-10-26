# perp-starter manages an existing position using PERP_SIDE, not the position's side
Severity: major
Area: SDK

## Steps to reproduce
1. Hold a short in the account (here: 3.99 SOL short on `0xf65EAcaE6AB6cA8a62d7B60Adde4946D3FFf25B8`).
2. `NETWORK=hideki PERP_SYMBOL=SOL-PERP OWNER_ADDRESS=0xf65EAcaE6AB6cA8a62d7B60Adde4946D3FFf25B8 DRY_RUN=true npx tsx strategies/perp-starter/src/index.ts` (default PERP_SIDE=long)

## Expected
Exit levels for the held short (take-profit below the mark, stop-loss above), or a refusal to start when PERP_SIDE disagrees with the position.

## Actual
```
already short 3.99 SOL, managing it instead of opening another
[dry-run] would watch take-profit 104.30 and stop-loss 101.24      (mark ≈ 102.26)
```
These are long-side levels on a short. Live, the bot closes the short as "take-profit" after a 2% move against it, and as "stop-loss" after a 1% move in its favour.

## Evidence
`strategies/perp-starter/src/index.ts`: `existing` is detected at `:121-123`, but every level uses `SIDE`:
- the levels at `:176-177`
- the watched-exit checks at `:224-225`
- `armBracket({ position: SIDE })` at `:187`, which in own-key mode arms long-closing sell stops for a short

## Environment
dreamdex-bot-kit @ 2579866 (markets-sdk 0.31.0) · Node 22.17 · Hideki testnet (50383) · checked 2026-10-26
