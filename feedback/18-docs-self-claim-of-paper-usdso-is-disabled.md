# Docs tell developers to self-claim paper USDso, but self-claim is disabled
Severity: major
Area: docs

## Steps to reproduce
1. New key with ~1.5 STT, no perp positions.
2. Run the documented snippet (/docs/developers/perps-testnet "Get test funds"; also `docs/PERPS.md:827`):
```ts
await markets.client.getPerpVoucherEligibility(marginBank, account)
await markets.trader.claimPerpVoucher({ marginBank })
```
Or: `eth_call` from the address to `0x2ACD9EFdA721450906bfE1bef3edE269636E42C4` with data `0x4e71d92d` (`claim()`).

## Expected
"Any address can claim the 1,000 USDso perps credit once": the claim succeeds.

## Actual
```
eligibility {"eligible":true,"grantAmount":"1000000000000000000000"}
claim reverted: for an unknown reason.     raw revert data: 0x3e31dcc2
```
`0x3e31dcc2` = `SelfClaimDisabled()`. A developer following the docs gets no test margin and can't trade.

## Evidence
Address `0x4E032bc4CC380710109B7681204701595fb0C9bA` (funded in tx `0xd68446b56e0e964893a2d67883f5ea76a159ada10e109bda35c27fe941b2e2c0`). Vouchers are only granted by the app (e.g. tx `0x69d9c52f92343bd9034707becebde06f78e871cda5c27b358e785cbc8b85da00`).

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17 · Hideki testnet (50383) · re-checked 2026-10-24
