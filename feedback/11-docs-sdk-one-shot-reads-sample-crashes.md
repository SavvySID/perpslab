# SDK "One-shot reads" sample filters on baseSymbol "WBTC" and crashes
Severity: normal
Area: docs

## Steps to reproduce
Run the "One-shot reads" sample (https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps, `docs/PERPS.md:1208` in the package):
```ts
const perps = await client.listPerpMarkets({ baseSymbol: "WBTC", limit: 20 });
const one = await client.getPerpMarket(perps[0].id);
```

## Expected
The sample finds the BTC perp.

## Actual
```
listPerpMarkets({ baseSymbol: "WBTC" }) -> 0 markets
TypeError: Cannot read properties of undefined (reading 'id')
```

## Evidence
The perp base symbol is `BTC` (`baseSymbol: "BTC"` → 1 market). `WBTC` is spot only.

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17 · Hideki testnet (50383)
