# Mirror

Copy-trading for dreamDEX perps on Somnia Tokyo testnet. Pick any trader, and Mirror copies their position changes into your perps account within seconds, scaled to your equity and capped per market.

## Who it's for

- **Traders who would rather follow than pick.** Find someone whose trading you trust (a Perps Arena leader, a friend, a desk) and run their book at your size.
- **Traders worth following.** Share your address and anyone can mirror you with one command, so a good track record turns into followers.

## What it does

- **Live copying through Somnia Reactivity.** Mirror subscribes to the MarginBank `PositionUpdated` event filtered to the leader's address with `somnia_watch`, so each leader fill is pushed the moment it lands, with no polling.
- **Target-position sync.** For every market it computes the position you should hold (`your target = scale × leader position`) and sends one IOC order for the difference. Missed events, restarts and partial fills heal on the next pass, and a full re-check runs every 20 s.
- **Copies new trades only, by default.** Positions the leader already held when you started are left alone, and closing them never opens the opposite side for you. Set `COPY_EXISTING=true` to copy them too.
- **Risk caps.** A USDso notional cap per market, a margin check at the exact price sent (`getMaxPerpOrderSize`), a slippage limit, an hourly cap on opening orders, and a 60 s back-off after a failed order.
- **Non-custodial.** Your funds stay in your dreamDEX account. Mirror's bot key can place orders for you through the app's Link a Bot grant, but it can't withdraw.
- **Dashboard.** A local page at `http://localhost:8787` shows the leader and your positions side by side, every copied order with its explorer link, and the reaction time from the leader's fill to yours. A **Share on X** button posts your copy stats.
- **Inspect before you copy.** `npm run inspect -- 0xTRADER` shows a trader's positions, uPnL and 24 h activity, what a copy at your scale would hold, and warns when an account trades like a market maker.

## How to run

Requirements: Node.js 20+ and a dreamDEX testnet account with perps margin (join Perps Arena on [app.testnet.dreamdex.io](https://app.testnet.dreamdex.io) for paper USDso).

1. Install:
   ```bash
   npm install
   cp .env.example .env
   ```
2. Create a fresh bot key and put it in `.env` as `PRIVATE_KEY`, for example with `node -e "console.log(require('viem/accounts').generatePrivateKey())"`. Never use a real wallet's key.
3. In the dreamDEX app, open your wallet, choose **Link a bot**, paste the bot's address, keep **Perps** and **Send it … for gas** ticked, and press **Add bot**. Set `FOLLOWER` to that wallet's address. A dedicated wallet (Wallet 2 or 3) works best, because Mirror manages the positions in every market it copies.
4. Pick a trader and check them:
   ```bash
   npm run inspect -- 0xTRADER
   ```
5. Set `LEADER` to that address and start in dry-run mode (the default), which logs what Mirror would do and sends nothing:
   ```bash
   npm start
   ```
6. When the dashboard looks right, set `DRY_RUN=false` and restart.

Other commands: `npm test` runs the sizing unit tests and `npm run typecheck` checks types.

## How it works

```
leader trades on dreamDEX
        │  MarginBank emits PositionUpdated(account = leader, perpPool, newSize)
        ▼
Somnia Reactivity (somnia_watch) pushes the log to Mirror
        ▼
target = scale × (leader size − size held before start), capped at MAX_NOTIONAL_USDSO
        ▼
IOC placeOrderFor(follower, side, target − your size) at mark ± slippage
        ▼
your position matches; the dashboard logs the tx and the reaction time
```

All sizes are exact bigint math in each market's raw units, rounded to the lot size and checked against the market minimum (see `src/sizing.ts` and `tests/sizing.test.ts`).

## Configuration

See [`.env.example`](./.env.example) for every setting: `SCALE` (`auto` uses your equity ÷ the leader's equity), `COPY_EXISTING`, `MAX_NOTIONAL_USDSO`, `SLIPPAGE_BPS`, `MARKETS`, `RECONCILE_SEC`, `MAX_ORDERS_PER_HOUR`, `DRY_RUN` and `PORT`.

## Limitations

- An IOC copy fills only within `SLIPPAGE_BPS` of the mark. On a thin book part of it may not fill; Mirror retries on the next pass.
- Copies smaller than a market's minimum order are skipped, so very small scales copy only the leader's larger trades.
- Trading the follower's copied markets by hand confuses the sync. Use a wallet dedicated to copying.
- Built for Somnia Tokyo testnet (chain 50383). The network constants live in `src/venue.ts`, ready to point at mainnet when perps launch there.

## Tech stack

TypeScript, `@somnia-chain/markets-sdk` 0.32.1, `@somnia-chain/reactivity` 0.2.1 (through the SDK's `/reactivity` entry), viem, Node's built-in HTTP server and test runner.

## Proof

First live run, 2026-10-28, copying an active Tokyo trader into a Perps Arena account at about 0.072x with a 100 USDso cap per market:

- 23 copy orders, all 23 succeeded on-chain and fully filled, across BTC, ETH, SOL and NEAR
- Average 3.05 s from the leader's fill being pushed by Reactivity to the copy confirming (range 2.44-3.94 s)
- First copy: [`0x0cf39358…08060be`](https://explorer.testnet.somnia.network/tokyo/tx/0x0cf39358c52871b0a16642611519b186b59efa06a4794f527b9b4d1ae08060be), sell 0.0428 ETH

Every transaction is listed in [`PROOF.md`](./PROOF.md).

## X posts

Links to posts about Mirror tagging @DreamDEXSomnia are added here once posted.
