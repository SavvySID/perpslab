# Docs describe a single 1,000 USDso credit; it is re-granted weekly and the locked floor stacks
Severity: normal
Area: docs

## Steps to reproduce
```js
await client.getMarginEvents(account, { kinds: ["Credited"], limit: 100 })   // every paper USDso grant
await client.getPerpVoucher("0x478769E1177C0773c43A593DCCc4Ad15F15F1394", account)
```
for Perps Arena accounts, e.g. `0x5c4c43b6dca4a53ccea06a7e9c03afd6b03ea931` and `0x49efa8c6e52c3d5a0ea8093b3ece96fa32cf6e01`.

## Expected
Per the docs, one 1,000 credit per account and a non-withdrawable floor of 1,000.

## Actual
```
0x5c4c… Credited 1000 @ 2026-10-06T09:43:11Z  tx 0xbd77d510c51f4578459d0c39062c5297d76a44b1ce850c263b86d323acc7450a
        Credited 1000 @ 2026-10-12T14:02:33Z  tx 0x26c0c049e951debaa676c6c2b39b3957716d3bc02977352b513dcda20282d481
        Credited 1000 @ 2026-10-19T15:52:17Z  tx 0x7a5c738b92843a3633407a53ddd4ac6d0fc1cc27c8a8d2df6eb6631b83399ffe
        voucher {"claimed":true,"floor":"3000000000000000000000","expiresAt":"1793634737"}
0x49ef… Credited 1000 @ 2026-10-13T14:48:07Z, 2026-10-19T15:54:20Z
        voucher {"claimed":true,"floor":"2000000000000000000000","expiresAt":"1793634860"}
```
Grants arrive weekly, the floor adds up (3,000 / 2,000), and `expiresAt` restarts at last grant + 14 days.

## Evidence
Wrong or incomplete text:
- /docs/developers/perps-testnet: "claim the 1,000 USDso perps credit once"
- /docs/trading/perps-testnet/margin-and-liquidations: "The 1,000 USDso that Perps Arena gives you is a credit voucher ... Only USDso above the voucher balance can leave the Perps account" (that floor grows by 1,000 each week)

The Perps Arena page itself says "1,000 paper USDso, every week".

## Environment
Hideki testnet (50383) · markets-sdk 0.32.1 · checked 2026-10-26
