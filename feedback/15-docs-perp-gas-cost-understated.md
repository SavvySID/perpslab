# Documented gas cost per perp transaction (0.0003-0.003 STT) is ~4x too low
Severity: normal
Area: docs

## Steps to reproduce
Compute `gasUsed × effectiveGasPrice` for recent transactions to perp pools (e.g. ETH-PERP `0xd6cb1dd58580b84d76068ac21594219ce03aeddf`).

## Expected
0.0003-0.003 STT each (/docs/developers/perps-testnet, "Get test funds").

## Actual
Base fee 6 gwei. Fees: min 0.0031, median 0.0107, max 0.0133 STT. Examples:
- `0xbf3613dff00326d886d576d43afe8517832c2f6f11cc726b96cc075be669bed9`: 0.01245 STT
- `0x50ccc6890330a32a3d6387b6917d320e2383348bd54c698609edb98a6896b6ed`: 0.01328 STT

## Evidence
The same page says placeOrderFor uses up to ~1.56M gas: 1.56M × 6 gwei = 0.0094 STT, above its own stated max.

## Environment
Hideki testnet (50383), RPC https://api.hideki2.infra.testnet.somnia.network
