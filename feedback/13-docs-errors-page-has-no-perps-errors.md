# Errors page has no perps errors, though the perps page sends readers there
Severity: normal
Area: docs

## Steps to reproduce
1. https://app.testnet.dreamdex.io/docs/developers/perps-testnet: "The full list of order errors is on the Errors page."
2. Open https://app.testnet.dreamdex.io/docs/developers/contracts/errors and search for perps errors.

## Expected
A PerpPool / MarginBank section.

## Actual
None of these appear (spot errors only):

| Error | Selector |
|---|---|
| InsufficientCollateral() | 0x3a23d825 |
| MaxPositionSizeExceeded() | 0x714b36d6 |
| InsufficientMarginForOrder() | 0x7ea61260 |
| IsolatedMarketBlocked() | 0xaa4fc774 |
| VoucherMarketNotAllowed() | 0x649b887d |

## Evidence
Page text checked 2026-10-24. Selectors = keccak256 of each signature.

## Environment
Any browser
