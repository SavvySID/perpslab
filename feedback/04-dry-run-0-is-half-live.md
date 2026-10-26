# DRY_RUN=0 sends orders live but skips the private-key and link checks
Severity: normal
Area: SDK

## Steps to reproduce
In dreamdex-bot-kit, with no PRIVATE_KEY:
```
NETWORK=hideki PERP_SYMBOL=ETH-PERP DRY_RUN=0     npx tsx strategies/perp-starter/src/index.ts
NETWORK=hideki PERP_SYMBOL=ETH-PERP DRY_RUN=false npx tsx strategies/perp-starter/src/index.ts
```

## Expected
`DRY_RUN=0` behaves exactly like `DRY_RUN=false`: `perp-core`'s `envBool` documents "0" as false.

## Actual
```
DRY_RUN=0:
perp-starter on ETH-PERP ... | dry-run false
read-only: no PRIVATE_KEY, so nothing will be sent. Set one to trade.
@somnia-chain/markets-sdk: createTrader is authenticated — construct SomniaMarkets with a privateKey ...

DRY_RUN=false:
PRIVATE_KEY is required for trading. Set it in .env, or run with DRY_RUN=true to log intended orders instead.
```
With `0` the bot says nothing will be sent, then takes the live path and crashes. perp-maker and perp-funding with `DRY_RUN=0` also skip the "key not linked" exit (`if (!link.ok && live) process.exit(1)`).

## Evidence
`packages/perp-core/src/config.ts:66-70` (`envBool`) treats "0" as false, but the strategies test the raw string: `process.env.DRY_RUN === "false"` (`perp-starter:65`, `perp-maker:79`, `perp-funding:57`, `perp-guard:83`). Fix: use `ctx.config.dryRun` everywhere.

## Environment
dreamdex-bot-kit @ 2579866 · Node 22.17 · Hideki testnet (50383) · re-checked 2026-10-26
