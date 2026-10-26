# OI caps in the market table are 2-4x too low on 20 of 21 markets; per-account cap isn't "a tenth"
Severity: normal
Area: docs

## Steps to reproduce
For each market, compare the "Open interest cap" column on /docs/trading/perps-testnet with `client.getPerpRiskParams(pool).maxOpenInterest` and `.maxPositionSize`.

## Expected
The table matches live `maxOpenInterest` (the page says "These figures are read from the live markets"), and the per-account cap is "a tenth" of it, as both perps pages state.

## Actual
| Market | Docs OI cap | Chain maxOpenInterest | Chain maxPositionSize | maxPos / maxOI |
|---|---|---|---|---|
| BTC | 246.81545 | 493.6309 (2x) | 100 | 1/4.9 |
| ETH | 3,995.6125 | 7,991.225 (2x) | 399.5612 | 1/20 |
| NEAR | 250,410 | 1,001,640 (4x) | 50,000 | 1/20 |
| ZRO | 250,599.5 | 1,002,398 (4x) | 25,059.9 | 1/40 |
| ZEC | 420 | 1,680 (4x) | 420 | 1/4 |
| TAO | 2,185.491 | 2,185.491 (match) | 218.549 | 1/10 |

- The column is wrong on 20 of 21 markets: 2x too low on BTC, ETH, SOL and HYPE, 4x too low on the other 16.
- maxPos/maxOI is 1/20 on 12 markets, 1/40 on 6, 1/4 on ZEC, 1/4.9 on BTC, and 1/10 only on TAO.

## Evidence
Wrong text: "A single account is capped at a tenth of it on most markets" (/docs/trading/perps-testnet) and "a tenth of the market's open interest cap on most markets" (/docs/developers/perps-testnet). Per the SDK, the contract keeps one market-wide OI counter, which is how the docs describe the cap too.

## Environment
Hideki testnet (50383) · markets-sdk 0.32.1 · checked 2026-10-26
