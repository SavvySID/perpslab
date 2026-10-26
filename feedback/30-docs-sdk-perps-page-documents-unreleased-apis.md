# SDK Perps docs page documents APIs that no published SDK has; its "trading gain" sample throws
Severity: normal
Area: docs

## Steps to reproduce
Install `@somnia-chain/markets-sdk` (npm `latest` = 0.32.1; the newest canary behaves the same) and follow https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps:
```js
typeof client.quotePerpClose            // "const q = await client.quotePerpClose({ pool, marginBank, account });"
typeof client.getPerpPositionsPage      // "client.getPerpPositionsPage({ pool, minSize, includeFlat, cursor }) reads all accounts' positions"
await client.getMarginEvents(account, { kinds: ["Deposit", "Credited", "Withdraw", "CreditReclaimed"], ...range, ...page })  // from the page's trading-gain sample
```

## Expected
The documented functions exist and the sample runs.

## Actual
```
client.quotePerpClose: undefined | client.getPerpPositionsPage: undefined | exchange.quotePerpClose: undefined
InvalidInputError: Margin event kinds must contain only Deposit, Withdraw, Locked, Unlocked, Credited; got CreditReclaimed
```
Further unreleased items on the same page:
- `sinceBlock` / `toBlock` ranges on `getMarginEvents` (0.32.1 ignores them)
- a `kind: "DepositFor"` margin event, of which the indexer has 0 rows

## Evidence
- None of these names exist in 0.32.1 `src/` or in `0.32.2-canary.38575926931`.
- The package's own `docs/PERPS.md:104-105` says "These reads cannot be bounded to a block yet", and `getMarginEvents` only filters on account and kinds (`src/perp/history.ts:662-663`).

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17 · Hideki testnet (50383) · checked 2026-10-26
