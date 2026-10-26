# perp-starter, perp-funding and perp-maker crash when their market goes close-only
Severity: major
Area: SDK

## Steps to reproduce
```ts
import { requireMarket } from "@dreamdex-bot-kit/perp-core";
const fake = { loadMarkets: async () => ({ "ETH/USDso:USDso": { symbol: "ETH/USDso:USDso", type: "swap", active: false,
  perpStatus: { restricted: true, registered: true, tradeable: true }, info: {} } }) };
await requireMarket(fake as any, "ETH/USDso:USDso", { reload: true });        // strategies' per-cycle call
await requireMarket(fake as any, "ETH/USDso:USDso", { includeHalted: true }); // perp-guard's call
```

## Expected
The per-cycle re-read still resolves a close-only market, so the bot can keep closing/cancelling.

## Actual
```
PERP_SYMBOL="ETH/USDso:USDso" does not match a live perp market. Live markets: (none).
```
The strategy exits: perp-starter stops watching its TP/SL, perp-funding doesn't close, perp-maker leaves quotes resting. The `includeHalted` call resolves.

## Evidence
`packages/perp-core/src/markets.ts:94` drops `!active` markets unless `includeHalted`. Callers without it: `perp-starter/src/index.ts:202`, `perp-funding/src/index.ts:95`, `perp-maker/src/index.ts:111`. perp-guard passes `includeHalted: true` (`:73,107`).

## Environment
dreamdex-bot-kit @ 2579866 · Node 22.17
