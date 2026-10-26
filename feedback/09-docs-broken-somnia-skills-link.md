# Operators page links to a GitHub repo that returns 404
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://app.testnet.dreamdex.io/docs/trading/spot/operators (Link a Bot points here for the contract side).
2. Follow the `dex-operator-trading` link, or `curl -sL -o /dev/null -w "%{http_code}" https://github.com/somnia-chain/somnia-skills`

## Expected
The skill repo opens.

## Actual
`404`

## Evidence
curl output above, 2026-10-24.

## Environment
Any browser / curl
