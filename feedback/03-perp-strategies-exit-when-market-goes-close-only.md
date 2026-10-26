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
- The SDK marks a close-only market inactive: `active: status ? !status.restricted && status.registered !== false : true` (markets-sdk `src/unified/exchange.ts:2076`).
- `packages/perp-core/src/markets.ts:94` drops `!active` markets unless `includeHalted`.
- Callers without it: `perp-starter/src/index.ts:202`, `perp-funding/src/index.ts:95`, `perp-maker/src/index.ts:111`. The throw reaches `main()`'s handler, which exits 1. perp-maker's call sits outside its try/catch, so the quote-cancel step after the loop never runs.
- perp-guard passes `includeHalted: true` (`:73,107`).
- Close-only pools do occur: the SDK's PERPS.md notes restricted pools on Shannon.

## Environment
dreamdex-bot-kit @ 2579866 · Node 22.17
