# perpPositionAnalytics rows don't re-sum to MarginBank equity: SDK truncates unrealized PnL, the bank floors it
Severity: normal
Area: SDK

## Steps to reproduce
For accounts with losing positions, at one pinned block:
1. Read `getAccountState`, `tryGetAccountEquity`, each `getPosition`, and each pool's `tryGetHealthSnapshot`.
2. Compute `unlockedCollateral + Σ perpPositionAnalytics(...).equityContribution`.
3. Compare with the bank's equity.

## Expected
Exact equality. PERPS.md: "lets the rows re-sum to the bank's own equity to the wei — a test pins that". `equityContribution` docs: "these add to `equity − collateral`, exactly".

## Actual
10 of 25 accounts are off by 1-4 wei, always SDK > chain:
```
NEAR 0x93f4Fde0E614b9b9EA78235773F4c49Bb0f71D29 chainEquity 10085715786239104528491 sdkSum 10085715786239104528494 diff 3
PUMP 0x3B39A768451904e7ea8f4A9BE135072B88940E5F chainEquity 818901892209266890502   sdkSum 818901892209266890506   diff 4
SOL  0xdf271A2B6De82cabED87cA117C29058fcE4Af0CC chainEquity 982845865317101280810   sdkSum 982845865317101280811   diff 1
```
Testing roundings over 42 accounts, the SDK formula (uPnL truncated, funding ceiled) matches 28. uPnL floored with funding ceiled matches all 42.

## Evidence
`src/perp/margin.ts:990`: `((p.markPrice - p.avgEntryPrice) * p.size) / p.oneBase`, a bare `/` that truncates toward zero, with comments at `:853`/`:903` saying the contract does the same. The deployed MarginBank floors toward −∞. Fix: floor-divide `unrealizedPnl`.

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17 · Hideki testnet (50383) · read-only views, checked 2026-10-26
