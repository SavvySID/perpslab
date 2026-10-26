# fetchOHLCV ignores `since`: always returns the newest candles, so ccxt pagination skips history
Severity: normal
Area: SDK

## Steps to reproduce
```js
await ex.loadMarkets()
const since = Date.parse("2026-10-23T15:00:00Z")
await ex.fetchOHLCV("BTC/USDso:USDso", "1h", since, 5)
```

## Expected
The 5 hourly candles starting at `since` (ccxt semantics; the `fetchFundingRateHistory` docblock says "`fetchOHLCV` has the same split", i.e. `since` walks forward).

## Actual
```
SDK fetchOHLCV(BTC/USDso:USDso, 1h, since=2026-10-23T15:00Z, limit=5) -> 2026-10-26T11:00Z ... 2026-10-26T15:00Z
indexer: first 5 1h candles with bucketStart >= since -> 2026-10-23T15:00Z ... 19:00Z   (73 exist)
ccxt pagination loop from since: pages=1 candles=5
```
With the default limit, a 1m read from 2 days back starts 39.7 h after `since`.

## Evidence
`src/unified/exchange.ts:2451`: `getCandles(t.pool, interval, { limit, market })`, with no `since`/`from`, newest-first. `since` is only applied afterwards as a filter (`:2458`). `fetchPriceOHLCV` does pass it (`:4979-4982`).

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17 · Hideki testnet (50383) · checked 2026-10-26
