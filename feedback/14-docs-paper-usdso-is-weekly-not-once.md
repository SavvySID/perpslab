# Docs say the 1,000 USDso perps credit is claimed once; it's re-granted weekly and stacks
Severity: normal
Area: docs

## Steps to reproduce
`client.getPerpVoucher("0x478769E1177C0773c43A593DCCc4Ad15F15F1394", account)` for Perps Arena accounts.

## Expected
Per /docs/developers/perps-testnet ("claim the 1,000 USDso perps credit once"): floor ≤ 1,000.

## Actual
```
0x5c4c43b6dca4a53ccea06a7e9c03afd6b03ea931 {"claimed":true,"floor":"3000000000000000000000","expiresAt":"1793634737"}
0x49efa8c6e52c3d5a0ea8093b3ece96fa32cf6e01 {"claimed":true,"floor":"2000000000000000000000","expiresAt":"1793634860"}
```
Floors of 3,000 and 2,000; expiry restarts with each grant.

## Evidence
Matches the Perps Arena page ("1,000 paper USDso, every week"). Docs should describe weekly, accumulating grants.

## Environment
Hideki testnet (50383) · markets-sdk 0.32.1
