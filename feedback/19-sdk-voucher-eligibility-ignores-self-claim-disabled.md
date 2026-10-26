# getPerpVoucherEligibility says eligible while claim() reverts SelfClaimDisabled; SDK can't decode it
Severity: normal
Area: SDK

## Steps to reproduce
```js
const mb = "0x478769E1177C0773c43A593DCCc4Ad15F15F1394";
await client.getPerpVoucherEligibility(mb, "0x4E032bc4CC380710109B7681204701595fb0C9bA"); // flat, never claimed
await trader.claimPerpVoucher({ marginBank: mb });                                      // with that key
```

## Expected
`{ eligible: false, reason: "selfClaimDisabled" }` (or similar), and a failed claim named `SelfClaimDisabled`.

## Actual
```
{"eligible":true,"grantAmount":"1000000000000000000000"}
claim reverted: for an unknown reason.   (revert data 0x3e31dcc2)
```

## Evidence
- `src/perp/voucher.ts:72-73` says checks run "in the order `VoucherDistributor.claim()` checks them", but `:212-232` never checks the self-claim switch.
- `SelfClaimDisabled()` (`0x3e31dcc2`) is missing from `contractErrorsAbi`.

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17 · Hideki testnet (50383)
