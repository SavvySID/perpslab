# DRY_RUN=0 sends orders live but skips the private-key and link checks
Severity: normal
Area: SDK

## Steps to reproduce
`NETWORK=hideki PERP_SYMBOL=ETH-PERP DRY_RUN=0 npx tsx strategies/perp-starter/src/index.ts`

## Expected
`DRY_RUN=0` behaves exactly like `DRY_RUN=false`.

## Actual
```
perp-starter on ETH-PERP ... | dry-run false
read-only: no PRIVATE_KEY, so nothing will be sent. Set one to trade.
@somnia-chain/markets-sdk: createTrader is authenticated — construct SomniaMarkets with a privateKey ...
```
Says nothing will be sent, takes the live path and crashes. perp-maker/perp-funding also skip the "key not linked" exit.

## Evidence
`packages/perp-core/src/config.ts:66-70` treats "0" as false, but the strategies check the raw string: `process.env.DRY_RUN === "false"` (`perp-starter:65`, `perp-maker:79`, `perp-funding:57`, `perp-guard:83`).

## Environment
dreamdex-bot-kit @ 2579866 · Node 22.17 · Hideki testnet (50383)
