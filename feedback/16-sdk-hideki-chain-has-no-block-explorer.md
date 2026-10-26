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
- `src/chains/definitions/hidekiTestnet.ts:38`: "No public block explorer is known for Hideki, so that field stays unset."
- But /docs/developers/perps-testnet lists "Explorer explorer.testnet.somnia.network/tokyo", and it serves Hideki pages: `https://explorer.testnet.somnia.network/tokyo/address/0x478769E1177C0773c43A593DCCc4Ad15F15F1394` returns 200.
- Wallets and viem tools using the SDK chain get no transaction links on the perps chain.

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17
