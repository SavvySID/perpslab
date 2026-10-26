# Documented gas per perp order (≤1.56M gas, 0.0003-0.003 STT) is several times too low
Severity: normal
Area: docs

## Steps to reproduce
1. Send `placeOrderFor` to a perp pool from your own bot key with viem or the SDK (default fees).
2. Read the receipt: `gasUsed`, `effectiveGasPrice`.

## Expected
Per /docs/developers/perps-testnet:
- "transactions to perp pools measured on testnet cost between 0.0003 and 0.003 STT each"
- "Successful `placeOrderFor` transactions on testnet used up to about 1.56M gas"

## Actual
All 8 of our own `placeOrderFor` transactions paid the 6 gwei base fee (`eth_gasPrice` = 6 gwei) and cost 0.0098-0.0185 STT, which is 3-6x the stated maximum:

| tx | gasUsed | fee (STT) |
|---|---|---|
| `0x27ff0c55e33b2d22ee5e0fcb968acd9f55598a503cc9ee0f5947504d4bf954a5` | 3,088,092 | 0.01853 |
| `0x0631c08a2b63768d34180ce271ee1eaf2ebdbfedb6b53854dce06094207f23a4` | 2,902,192 | 0.01741 |
| `0x712ef0283250b8737e813db5478db79fbcccf0945c8a3034c8c836ef8252a7d3` | 1,670,714 | 0.01002 |
| `0x554b1a12814344fd020e6520e2f909970f1042d381e15af76adf85b646d7771f` | 1,648,785 | 0.00989 |

Across the last 237 successful `placeOrderFor` transactions on chain, 228 used more than 1.56M gas (median 2.9M, max 6.48M, e.g. `0x2c9d522306a6900e9300dd5609415afa784b419b0b6485bda638246d28e8b771`).

Orders that sweep several levels use far more. The page calls 10,000,000 "a generous limit" (the bot kit's `ORDER_GAS`), but these orders would run out of gas under it:
- `0xbf18a5f2e86a18f05648706268641df009e992bd773083cac60b2f2cb12fef1b`: gasUsed 16,393,603, fee 0.098 STT
- `0xc2fbfe682fe7fa3360fc8e395ef2fed609ab61fe06df10837a76d21267fd4cbe`: gasUsed 11,751,629, fee 0.071 STT

## Evidence
Receipts above. Some other senders pay an effective 0.6 gwei, but a new key using default viem/SDK fees pays 6 gwei, and gas used alone is far above the documented 1.56M.

## Environment
Hideki testnet (50383), RPC https://api.hideki2.infra.testnet.somnia.network · checked 2026-10-26
