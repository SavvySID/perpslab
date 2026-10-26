# hidekiTestnet chain definition has no blockExplorers
Severity: normal
Area: SDK

## Steps to reproduce
```js
import { hidekiTestnet, somniaShannon } from "@somnia-chain/markets-sdk/chains";
console.log(hidekiTestnet.blockExplorers, somniaShannon.blockExplorers);
```

## Expected
`hidekiTestnet.blockExplorers.default.url = "https://explorer.testnet.somnia.network/tokyo"` (the explorer the perps docs list), as Shannon and mainnet have.

## Actual
`undefined` for hidekiTestnet; Shannon and mainnet both define one.

## Evidence
`https://explorer.testnet.somnia.network/tokyo` returns 200. Wallets/viem tools using the SDK chain can't link perps transactions.

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17
