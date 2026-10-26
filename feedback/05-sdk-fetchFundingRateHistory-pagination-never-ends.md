# fetchFundingRateHistory: the documented pagination loop never ends
Severity: major
Area: SDK

## Steps to reproduce
```js
await ex.loadMarkets();
let since = Date.now() - 2 * 86400_000;
for (let i = 0; i < 6; i++) {               // the docblock's loop has no cap
  const page = await ex.fetchFundingRateHistory("BTC/USDso:USDso", since, 100);
  if (page.length === 0) break;
  since = page[page.length - 1].timestamp + 1;  // as documented
}
```

## Expected
The last call returns 0 rows; no row has `timestamp < since`.

## Actual
```
iter 4: since=1792840303001 -> 1 rows, first=1792840303000 last=1792840303000
iter 5: since=1792840303001 -> 1 rows, first=1792840303000 last=1792840303000
```
The same row returns forever.

## Evidence
`src/unified/exchange.ts:5707`: `from: Math.floor(since / 1000)` used as an inclusive bound, so `last + 1 ms` floors back to the last row's second. Fix: `Math.ceil`, or filter `ts >= since` like `fetchOHLCV`.

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17 · Hideki testnet (50383)
