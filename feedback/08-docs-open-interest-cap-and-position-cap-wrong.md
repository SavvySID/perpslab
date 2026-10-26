# OI caps in the market table are 2-4x too low; per-account cap isn't "a tenth"
Severity: normal
Area: docs

## Steps to reproduce
Compare /docs/trading/perps-testnet "Open interest cap" with `client.getPerpRiskParams(pool).maxOpenInterest` and `.maxPositionSize`.

## Expected
Table = live `maxOpenInterest`; per-account cap = "a tenth" of it (as both perps pages state).

## Actual
| Market | Docs OI cap | Chain maxOI | Chain maxPos | maxPos/maxOI |
|---|---|---|---|---|
| BTC | 246.81545 | 493.631 | 100 | 0.20 |
| ETH | 3,995.6125 | 7,991.225 | 399.561 | 0.05 |
| ZRO | 250,599.5 | 1,002,398 | 25,059.9 | 0.025 |

Wrong on 20 of 21 markets. The ratio is 1/20 on 12 markets, 1/40 on 6, and 1/10 only on TAO.

## Evidence
Wrong text: "A single account is capped at a tenth of it on most markets" (/docs/trading/perps-testnet) and "a tenth of the market's open interest cap on most markets" (/docs/developers/perps-testnet).

## Environment
Hideki testnet (50383) · markets-sdk 0.32.1 · checked 2026-10-24
