# fetchPositions() dates every perp position 1970-01-01
Severity: normal
Area: SDK

## Steps to reproduce
```js
const ex = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl, addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
                               account: "0xf65EAcaE6AB6cA8a62d7B60Adde4946D3FFf25B8" })
const [p] = await ex.fetchPositions()
console.log(p.symbol, p.timestamp, p.datetime)
```

## Expected
`timestamp` = "When the position last changed on-chain (ms)" (`UnifiedPosition`, `src/unified/structs.ts:610`), or `undefined` if unknown.

## Actual
```
SOL/USDso:USDso short 3.99 | timestamp=0 datetime=1970-01-01T00:00:00.000Z | info.position.lastUpdatedTimestampNs=0
  last PositionUpdated for this position: block 30366713 at 2026-10-22T17:04:53Z
```
`getPosition().lastUpdatedTimestampNs` is 0 on 38 of 38 recently changed open positions (block 33757986), including one changed 10 blocks earlier.

## Evidence
`src/unified/exchange.ts:5816`: `tsMs = Number(pos.lastUpdatedTimestampNs / 1_000_000n)`. `MarginBank.getPosition` returns 0 in that field for every position, so `0` becomes the epoch (`:5827-5828`, `:5859-5860`). Fix: treat 0 as unknown, or use the indexer's last `PerpPositionChange`.

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17 · Hideki testnet (50383) · checked 2026-10-26
