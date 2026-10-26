# Contracts docs say to discover markets via GET /v0/markets, but it returns no perps
Severity: normal
Area: docs

## Steps to reproduce
1. /docs/developers/contracts: "To discover available markets and their contract addresses, query the `GET /v0/markets` endpoint."
2. `curl -s https://stg.api.dreamdex.io/v0/markets`

## Expected
Perp markets listed, or docs pointing non-SDK users elsewhere (factory `getPerpPools()`, a perps section on the Addresses page).

## Actual
```
3 markets, kinds ['spot']: SOMI:USDso, WBTC:USDso, WETH:USDso
```
The Addresses page has no perps chain (50383) section, and the HTTP/WebSocket references are spot-only.

## Evidence
curl output above, 2026-10-24.

## Environment
curl · REST base https://stg.api.dreamdex.io/v0
