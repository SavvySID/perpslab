# SDK says Hideki has 10 ms blocks (~100 blocks/s); it runs at 100 ms (10 blocks/s)
Severity: normal
Area: SDK

## Steps to reproduce
```js
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
console.log(hidekiTestnet.blockTime)                          // SDK constant
const h = await pc.getBlockNumber(), a = await pc.getBlock({ blockNumber: h }), b = await pc.getBlock({ blockNumber: h - 100000n })
console.log(Number(a.timestamp - b.timestamp) * 1000 / 100000, "ms/block")
```

## Expected
`blockTime` and the docs match the chain.

## Actual
```
hidekiTestnet.blockTime = 10   (somniaShannon.blockTime = 100)
Hideki: 100000 blocks in 10005 s -> 100.05 ms/block
```

## Evidence
Wrong text on somnia-platform-docs.vercel.app/markets/somnia-markets/:
- `typescript/chains`: "`hidekiTestnet` 50383 STT 10 ms" and "Hideki is the low-latency Tokyo network — ~100 blocks/s"
- `typescript/reference/networks-and-endpoints`: "hidekiTestnet 50383 Hideki Testnet STT (18) 10 ms"
- `typescript/bridge`: "Hideki is a ~10 ms-block network built for traders"

Anyone converting blocks to time with the SDK's figure (timeouts, "N blocks ≈ T" estimates) is off by 10x.

## Environment
@somnia-chain/markets-sdk 0.32.1 · Hideki testnet (50383) · checked 2026-10-26
