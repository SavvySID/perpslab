# perpslab

Tools, experiments, and feedback for dreamDEX perpetual trading on Somnia Tokyo testnet.

## Goals

- Test the dreamDEX Perps API and SDK.
- Report reproducible bugs, API/SDK issues, and documentation gaps.
- Build a useful perps trading tool or AI-powered trading agent.
- Execute and verify real perps orders on testnet.

## Projects

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

19 reproducible reports in [`feedback/`](./feedback), one Markdown file per issue in the bounty template (6 major, 13 normal).

| # | Report | Severity | Area | Summary |
|---|---|---|---|---|
| 01 | [perp-starter swaps TP and SL for shorts](./feedback/01-perp-starter-short-tp-sl-swapped.md) | major | SDK | Short brackets use the stop-loss % for take-profit and the take-profit % for stop-loss. |
| 02 | [perp-starter manages a position with the wrong side](./feedback/02-perp-starter-manages-existing-position-with-wrong-side.md) | major | SDK | A held short gets long-side exit levels, so a 2% adverse move closes it as "take-profit". |
| 03 | [Perp strategies exit when the market goes close-only](./feedback/03-perp-strategies-exit-when-market-goes-close-only.md) | major | SDK | perp-starter, perp-funding and perp-maker stop, leaving TP/SL unwatched and quotes resting. |
| 04 | [DRY_RUN=0 is half-live](./feedback/04-dry-run-0-is-half-live.md) | normal | SDK | `DRY_RUN=0` takes the live path but skips the private-key and link checks, then crashes. |
| 05 | [fetchFundingRateHistory pagination never ends](./feedback/05-sdk-fetchFundingRateHistory-pagination-never-ends.md) | major | SDK | The documented loop returns the same last row forever because `since` is floored to the second. |
| 06 | [Perps Quick start symbol doesn't exist](./feedback/06-docs-perps-quickstart-symbol-does-not-exist.md) | normal | docs | The sample uses `BTC/USDSO:USDSO`; the live symbol is `BTC/USDso:USDso`. |
| 07 | [Paper USDso allowlist is wrong](./feedback/07-docs-paper-usdso-allowlist-wrong.md) | normal | docs | Docs say 6 markets block paper USDso; all 21 allow it on chain. |
| 08 | [Open interest and position caps are wrong](./feedback/08-docs-open-interest-cap-and-position-cap-wrong.md) | normal | docs | Documented OI caps are 2-4x below chain values, and the per-account cap isn't "a tenth". |
| 09 | [Broken somnia-skills link](./feedback/09-docs-broken-somnia-skills-link.md) | normal | docs | The Operators page links to a GitHub repo that returns 404. |
| 10 | [Bot kit sizes at the touch but sends past it](./feedback/10-perp-core-sizes-at-touch-but-sends-past-it.md) | major | SDK | Orders are sized at the best price but sent 20 bps worse, so clamped sizes revert with `InsufficientCollateral()`. |
| 11 | [One-shot reads sample crashes](./feedback/11-docs-sdk-one-shot-reads-sample-crashes.md) | normal | docs | The sample filters on `baseSymbol: "WBTC"`, finds no perp market and crashes. |
| 12 | [SDK docs list stale perp markets](./feedback/12-docs-sdk-perp-market-list-stale.md) | normal | docs | Docs list BTC/ETH only, or 15 pools; the factory returns 21. |
| 13 | [Errors page has no perps errors](./feedback/13-docs-errors-page-has-no-perps-errors.md) | normal | docs | The perps docs point to an Errors page with no PerpPool or MarginBank errors. |
| 14 | [Paper USDso is weekly, not once](./feedback/14-docs-paper-usdso-is-weekly-not-once.md) | normal | docs | Docs say the 1,000 USDso credit is claimed once; it's re-granted weekly and stacks. |
| 15 | [Perp gas cost is understated](./feedback/15-docs-perp-gas-cost-understated.md) | normal | docs | Real perp transaction fees are about 0.003-0.013 STT, not the documented 0.0003-0.003. |
| 16 | [No perps market discovery outside the SDK](./feedback/16-docs-no-perps-market-discovery-outside-sdk.md) | normal | docs | `GET /v0/markets` returns only spot markets, though the docs say to use it for discovery. |
| 17 | [hidekiTestnet has no block explorer](./feedback/17-sdk-hideki-chain-has-no-block-explorer.md) | normal | SDK | The SDK's Hideki chain defines no `blockExplorers`, unlike Shannon and mainnet. |
| 18 | [Self-claim of paper USDso is disabled](./feedback/18-docs-self-claim-of-paper-usdso-is-disabled.md) | major | docs | The documented voucher claim reverts with `SelfClaimDisabled()`, so new developers get no test margin. |
| 19 | [Voucher eligibility ignores the self-claim switch](./feedback/19-sdk-voucher-eligibility-ignores-self-claim-disabled.md) | normal | SDK | `getPerpVoucherEligibility` says eligible while `claim()` reverts, and the SDK can't decode the error. |

## Project Structure

- `dreamperps/` — SDK integration: market reads and order placement.
- `feedback/` — Reproducible feedback reports for the Feedback track.
- `app/` — Perps MVP application.
- `tests/` — Integration tests and experiments.

## Network

Somnia Tokyo Testnet (chain ID 50383)

## Status

Under development.

Features and test results will be documented as they are implemented and verified.
