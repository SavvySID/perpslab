# SDK perps Quick start uses "BTC/USDSO:USDSO", which doesn't exist
Severity: normal
Area: docs

## Steps to reproduce
1. Follow the Quick start at https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps (also `docs/PERPS.md` ~line 1196).
2. `await exchange.loadMarkets(); await exchange.fetchFundingRate("BTC/USDSO:USDSO")`

## Expected
The sample runs.

## Actual
```
InvalidInputError: unknown symbol BTC/USDSO:USDSO — call loadMarkets() first
```

## Evidence
Live symbols use the token's real case: `BTC/USDso:USDso`. The same wrong symbol is in the `fetchFundingRateHistory` docblock (`src/unified/exchange.ts:5686`). The error also wrongly blames `loadMarkets()`.

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17 · Hideki testnet (50383)
