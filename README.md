# perpslab

Tools, experiments, and feedback for dreamDEX perpetual trading on Somnia Tokyo testnet.

## Goals

- Test the dreamDEX Perps API and SDK.
- Report reproducible bugs, API/SDK issues, and documentation gaps.
- Build a useful perps trading tool or AI-powered trading agent.
- Execute and verify real perps orders on testnet.

## Projects

### Mirror (MVP track)

Copy-trading for dreamDEX perps. Pick any trader, and Mirror copies their position changes into your perps account within seconds, scaled to your equity and capped per market. It listens for the leader's fills through Somnia Reactivity, places IOC orders for you through the app's Link a Bot grant (so it can trade but never withdraw), and shows everything on a local dashboard with a Share on X button.

See [`mirror/README.md`](./mirror/README.md) for what it does, who it's for and how to run it.

### DreamPerps

A testnet perps tool built with `@somnia-chain/markets-sdk` 0.32.1.

- Reads live perpetual markets and mark prices.
- Places small limit orders, either from its own account or for a wallet that linked it through Link a Bot.
- Transaction evidence is in [`dreamperps/PROOF.md`](./dreamperps/PROOF.md).

See [`dreamperps/README.md`](./dreamperps/README.md) for setup and usage.

#### Proof of build

A perps order placed by this code on Somnia Tokyo testnet and confirmed on-chain:

| | |
|---|---|
| Transaction hash | `0xfe9d0c55b42eec287739ba4ad952573401012eff93de66a38d41a2fb62985a1a` |
| Transaction link | [explorer.testnet.somnia.network/tokyo/tx/0xfe9d0c55…2985a1a](https://explorer.testnet.somnia.network/tokyo/tx/0xfe9d0c55b42eec287739ba4ad952573401012eff93de66a38d41a2fb62985a1a) |
| Order | Limit buy 0.00013 BTC at 76,627.2 (5% under mark), BTC/USDso perp |
| Block | 31947072 |
| Bot wallet | `0xd862604236d4854e87C35b6269D5cdB28971C8b4` |
| Linked perps wallet | `0xc1408020e85e9e817e821c8bcdeb913277fa1679` |

## Feedback track

34 reproducible reports in [`feedback/`](./feedback), one Markdown file per issue in the bounty template (7 major, 27 normal). All were re-verified on 2026-10-26; write paths were tested only by simulation on our own linked accounts. Reports 01-04, 10, 24 and 25 cover the official [dreamDEX bot kit](https://github.com/somnia-chain/dreamdex-bot-kit), and reports 27-29 include screenshots in [`feedback/img/`](./feedback/img).

| # | Report | Severity | Area | Summary |
|---|---|---|---|---|
| 01 | [perp-starter swaps TP and SL for shorts](./feedback/01-perp-starter-short-tp-sl-swapped.md) | major | SDK | Short brackets use the stop-loss % for take-profit and the take-profit % for stop-loss. |
| 02 | [perp-starter manages a position with the wrong side](./feedback/02-perp-starter-manages-existing-position-with-wrong-side.md) | major | SDK | A held short gets long-side exit levels, so a 2% move against it closes it as "take-profit". |
| 03 | [Perp bots crash when the market goes close-only](./feedback/03-perp-strategies-exit-when-market-goes-close-only.md) | major | SDK | perp-starter, perp-funding and perp-maker exit, leaving TP/SL unwatched and quotes resting. |
| 04 | [DRY_RUN=0 is half-live](./feedback/04-dry-run-0-is-half-live.md) | normal | SDK | `DRY_RUN=0` takes the live path but skips the private-key and link checks, then crashes. |
| 05 | [fetchFundingRateHistory pagination never ends](./feedback/05-sdk-fetchFundingRateHistory-pagination-never-ends.md) | major | SDK | The documented loop returns the same last row forever because `since` is floored to the second. |
| 06 | [Perps Quick start symbol doesn't exist](./feedback/06-docs-perps-quickstart-symbol-does-not-exist.md) | normal | docs | The sample uses `BTC/USDSO:USDSO`; the live symbol is `BTC/USDso:USDso`. |
| 07 | [Paper USDso "blocked" on 6 markets, trades all 21](./feedback/07-docs-paper-usdso-allowlist-wrong.md) | normal | docs | Docs say paper USDso can't open positions on 6 markets; on chain it trades all 21. |
| 08 | [OI caps too low; per-account cap isn't a tenth](./feedback/08-docs-open-interest-cap-and-position-cap-wrong.md) | normal | docs | Documented OI caps are 2-4x below chain values on 20 of 21 markets, and the per-account cap isn't "a tenth". |
| 09 | [Operators page links to a 404 repo](./feedback/09-docs-broken-somnia-skills-link.md) | normal | docs | The Operators and Spot Router pages link to a GitHub repo that returns 404. |
| 10 | [Bot kit sizes at the touch but sends past it](./feedback/10-perp-core-sizes-at-touch-but-sends-past-it.md) | major | SDK | Orders are sized at the best price but sent 20 bps worse, so clamped sizes revert with `InsufficientCollateral()`. |
| 11 | [One-shot reads sample crashes](./feedback/11-docs-sdk-one-shot-reads-sample-crashes.md) | normal | docs | The sample filters on `baseSymbol: "WBTC"`, finds no perp market and crashes. |
| 12 | [SDK docs list stale perp markets](./feedback/12-docs-sdk-perp-market-list-stale.md) | normal | docs | Docs list BTC/ETH only, or 15 pools; the factory returns 21. |
| 13 | [Errors page has no perps errors](./feedback/13-docs-errors-page-has-no-perps-errors.md) | normal | docs | The perps docs point to an Errors page with no PerpPool or MarginBank errors. |
| 14 | [Paper USDso is weekly and stacks, not once](./feedback/14-docs-paper-usdso-is-weekly-not-once.md) | normal | docs | Docs describe one 1,000 USDso credit; it's re-granted weekly and the locked floor grows. |
| 15 | [Perp gas cost is understated](./feedback/15-docs-perp-gas-cost-understated.md) | normal | docs | Real `placeOrderFor` transactions use 1.6-6.5M gas and 0.01-0.02 STT, several times the documented maximum. |
| 16 | [hidekiTestnet has no block explorer](./feedback/16-sdk-hideki-chain-has-no-block-explorer.md) | normal | SDK | The SDK's Hideki chain defines no `blockExplorers`, though the docs list a working one. |
| 17 | [Self-claim of paper USDso is disabled](./feedback/17-docs-self-claim-of-paper-usdso-is-disabled.md) | major | docs | The documented voucher claim reverts with `SelfClaimDisabled()`, so new developers get no test margin. |
| 18 | [Voucher eligibility ignores the self-claim switch](./feedback/18-sdk-voucher-eligibility-ignores-self-claim-disabled.md) | normal | SDK | `getPerpVoucherEligibility` says eligible while `claim()` reverts, and the SDK can't decode the error. |
| 19 | [Perp TP/SL fails with bundled Hideki addresses](./feedback/19-sdk-perp-stop-orders-fail-with-bundled-hideki-addresses.md) | normal | SDK | `placePerpStopOrder` throws `NotConfiguredError` because the Hideki address set has no operator registry. |
| 20 | [Position analytics rounding doesn't match MarginBank](./feedback/20-sdk-position-analytics-rounding-does-not-match-margin-bank.md) | normal | SDK | The SDK truncates unrealized PnL while the bank floors it, so rows miss equity by 1-4 wei. |
| 21 | [fetchOHLCV ignores `since`](./feedback/21-sdk-fetchOHLCV-ignores-since.md) | normal | SDK | It always returns the newest candles, so ccxt-style pagination skips history. |
| 22 | [fetchPositions dates positions 1970-01-01](./feedback/22-sdk-fetchPositions-timestamp-is-1970.md) | normal | SDK | The chain returns 0 for the last-update time and the SDK turns it into the Unix epoch. |
| 23 | [getMaxPerpOrderSize docs contradict the code](./feedback/23-sdk-getMaxPerpOrderSize-docs-say-gates-not-modelled.md) | normal | SDK | Docs say close-only and isolated gates aren't modelled, but the code checks both. |
| 24 | [Keyless dry run prints 0-size orders](./feedback/24-perp-bots-keyless-dry-run-prints-zero-size-orders.md) | normal | SDK | Without a key, perp-maker and perp-starter "would place" orders below the market minimum as size 0. |
| 25 | [perp-guard keyless promises health, prints nothing](./feedback/25-perp-guard-keyless-says-health-is-reported-then-silent.md) | normal | SDK | Without a key or owner address it says health is reported, then stays silent forever. |
| 26 | [Voucher account can change leverage](./feedback/26-docs-voucher-account-can-change-leverage.md) | normal | docs | Docs say a paper-USDso account can't change its leverage; MarginBank accepts the change. |
| 27 | [Trader page misses Tokyo perps orders](./feedback/27-app-trader-page-open-orders-misses-perps-orders.md) | normal | app | The Open orders tab reads only the Global network, so resting Tokyo perps orders are missing. |
| 28 | [Logged-out perps links redirect to spot](./feedback/28-app-logged-out-perps-links-silently-redirect-to-spot.md) | normal | app | Logged out, every perps link silently lands on the STT/USDso spot market. |
| 29 | [dreamBot Builder offers 15 of 21 perps markets](./feedback/29-app-dreambot-builder-lists-15-of-21-perps-markets.md) | normal | app | The builder's hard-coded list leaves out ZEC, PUMP, 1000PEPE, VVV, LIT and ZRO. |
| 30 | [SDK Perps page documents unreleased APIs](./feedback/30-docs-sdk-perps-page-documents-unreleased-apis.md) | normal | docs | `quotePerpClose`, `getPerpPositionsPage` and more exist in no published SDK, and the trading-gain sample throws. |
| 31 | [Docs say no backstop bidder; one is registered](./feedback/31-docs-says-no-backstop-bidder-but-one-is-registered.md) | normal | docs | A backstop bidder is registered and has already taken over liquidated positions. |
| 32 | [Hideki blocks are 100 ms, not 10 ms](./feedback/32-sdk-hideki-block-time-10ms-is-100ms.md) | normal | SDK | `hidekiTestnet.blockTime` and the docs are off by 10x, which skews block-to-time conversions. |
| 33 | [USDso bridge Shannon → Hideki is broken](./feedback/33-contracts-usdso-bridge-to-hideki-broken.md) | major | contracts | Since 2026-10-07 every `transferRemote` reverts in a misconfigured hook, blocking the only documented way to bring USDso to the perps chain. |
| 34 | [SDK docs site has broken links](./feedback/34-docs-sdk-site-broken-links.md) | normal | docs | "Edit this page", the deployment-record link and several anchors lead to 404s or the top of the page. |

## Project Structure

- `mirror/` — Mirror, the MVP: copy-trading bot, trader inspector, dashboard and unit tests.
- `dreamperps/` — SDK integration: market reads and order placement.
- `feedback/` — Reproducible feedback reports for the Feedback track.

## Network

Somnia Tokyo Testnet (chain ID 50383)

## Status

Under development.

Features and test results will be documented as they are implemented and verified.
