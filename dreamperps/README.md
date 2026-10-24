# DreamPerps

Places perps orders on dreamDEX (Somnia Tokyo / Hideki testnet, chain 50383) with [`@somnia-chain/markets-sdk`](https://www.npmjs.com/package/@somnia-chain/markets-sdk) 0.32.1.

## Setup

```bash
npm install
npm run wallet    # creates a fresh testnet bot key in .env and prints its address
```

Fund the bot with STT for gas: in [app.testnet.dreamdex.io/perps](https://app.testnet.dreamdex.io/perps), open your wallet, choose **Link a bot**, paste the bot address, keep **Perps** and **Send it … for gas** on, and press **Add bot**. The bot needs about 0.6 STT.

## Run

```bash
npm run markets   # read-only: list perp markets and mark prices
npm run order     # rest a small BTC limit buy 5% under mark
```

Set `OWNER` in `.env` to the wallet that linked the bot, and the bot trades that wallet's perps account through `placeOrderFor`. Leave it empty to trade the bot's own account, which first tries to claim the paper USDso voucher. Set `MARKET` to trade another market (for example `ETH`). Each transaction hash is appended to `PROOF.md`.

## Proof

Limit buy of 0.00013 BTC at 76,627.2 (5% under mark), placed by the bot for its linked wallet with `placeOrderFor` and confirmed on-chain:
[`0xfe9d0c55…2985a1a`](https://explorer.testnet.somnia.network/tokyo/tx/0xfe9d0c55b42eec287739ba4ad952573401012eff93de66a38d41a2fb62985a1a) (block 31947072). See [`PROOF.md`](./PROOF.md).
