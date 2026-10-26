# SDK docs list stale perp markets (BTC/ETH only; 15 of 21 pools)
Severity: normal
Area: docs

## Steps to reproduce
Call `getPerpPools()` on PerpPoolFactory `0xE631fAEE547baeE07353E290f0562ea67d856560` and compare with:
- https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps: "Perps are live on testnet: `BTC/USDSO:USDSO` and `ETH/USDSO:USDSO`"
- https://somnia-platform-docs.vercel.app/markets/somnia-markets/contracts: lists 15 PerpPools and says "`getPerpPools()` returns the same list"

## Expected
The pages match the chain.

## Actual
`getPerpPools()` returns 21 pools. Missing from the Contracts page: ZEC `0x2A73…F050`, PUMP `0x76C9…36E7`, 1000PEPE `0xfa9B…6B6F`, VVV `0x3526…6409`, LIT `0xdCb0…2a3F`, ZRO `0x2a18…F16c`.

## Evidence
Chain read above, 2026-10-26.

## Environment
Hideki testnet (50383) · markets-sdk 0.32.1
