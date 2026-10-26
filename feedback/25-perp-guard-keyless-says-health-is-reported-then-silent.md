# perp-guard without a key says "health is reported", then reports nothing forever
Severity: normal
Area: SDK

## Steps to reproduce
In dreamdex-bot-kit, no PRIVATE_KEY and no OWNER_ADDRESS:
```
NETWORK=hideki DRY_RUN=true npx tsx strategies/perp-guard/src/index.ts
```

## Expected
Either health is reported, or the bot says what's missing ("set OWNER_ADDRESS to watch an account") and exits.

## Actual
```
perp-guard | reduce 25% below 1.5x maintenance, flatten below 1.15x | dry-run true
read-only: no PRIVATE_KEY, so health is reported but nothing is closed.
```
Then no output at all; still silent after 60 s (killed by timeout, exit 124). With `OWNER_ADDRESS` set it does report: `SOL-PERP: short 3.99 (407.70 USDso) | health 99.008x maintenance | status Healthy`.

## Evidence
`strategies/perp-guard/src/index.ts:99-100` prints the message, then the poll loop does `for (const market of markets) { if (!me) break; … }` (`:136`), so every cycle does nothing.

## Environment
dreamdex-bot-kit @ 2579866 · Node 22.17 · Hideki testnet (50383) · checked 2026-10-26
