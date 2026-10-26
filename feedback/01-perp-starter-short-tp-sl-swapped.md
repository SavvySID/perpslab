# perp-starter swaps take-profit and stop-loss percentages for shorts
Severity: major
Area: SDK

## Steps to reproduce
1. In dreamdex-bot-kit: `npm install`
2. `NETWORK=hideki PERP_SYMBOL=ETH-PERP PERP_SIDE=short PERP_TAKE_PROFIT_PCT=2 PERP_STOP_LOSS_PCT=1 DRY_RUN=true npm start -w perp-starter`

## Expected
Short: take-profit = mark × 0.98, stop-loss = mark × 1.01.

## Actual
Short: take-profit = mark × 0.99, stop-loss = mark × 1.02.
```
[dry-run] would arm a short bracket on ETH-PERP: take-profit 2294.42, stop-loss 2363.95   (mark ≈ 2317.6, 2026-10-26)
```

## Evidence
`strategies/perp-starter/src/index.ts:174-177`: `up` uses TAKE_PROFIT_PCT and `down` uses STOP_LOSS_PCT; for a short they are just swapped (`takeProfit = down`, `stopLoss = up`). Affects armed brackets and watched exits. Fix: short TP = mark × (1 − TP%), SL = mark × (1 + SL%).

## Environment
dreamdex-bot-kit @ 2579866 (markets-sdk 0.31.0) · Node 22.17 · Hideki testnet (50383)
