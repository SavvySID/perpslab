# SDK docs site: "Edit this page", deployment-record and several anchor links are broken
Severity: normal
Area: docs

## Steps to reproduce
On somnia-platform-docs.vercel.app/markets/somnia-markets/…, follow:
1. "Edit this page" (404 on all 5 pages checked: `typescript/perps`, `typescript/chains`, `typescript/bridge`, `contracts`, `typescript`), e.g. `typescript/perps` → `https://github.com/somnia-chain/somnia-markets/blob/main/packages/sdk/docs/PERPS.md`
2. "Full deployment record" on `typescript/bridge` → `https://github.com/somnia-chain/hyperlane-bridge-infra/blob/main/docs/deployments/somnia-testnet-hideki2-testnet.md`
3. On `typescript/exchange`, the link to `engine#errors--branch-on-the-type-never-the-message`

## Expected
The targets open.

## Actual
```
404 https://github.com/somnia-chain/somnia-markets/blob/main/packages/sdk/docs/PERPS.md
404 https://github.com/somnia-chain/somnia-markets/blob/main/packages/sdk/docs/BRIDGE.md
404 https://github.com/somnia-chain/hyperlane-bridge-infra/blob/main/docs/deployments/somnia-testnet-hideki2-testnet.md
```
The anchor link uses `errors--branch-…` (double hyphen); the target heading id is `errors-branch-on-the-type-never-the-message`, so it lands at the top of the page.

The same double-hyphen pattern breaks `migrating` → `prices#reading--live` (real id `reading-live`). `how-to/configure-for-a-network` → `tutorials/place-and-cancel-your-first-order#create-the-exchange-with-a-signer` misses too (real id starts `1-create-…`).

## Evidence
curl output above, 2026-10-26.

## Environment
Any browser / curl
