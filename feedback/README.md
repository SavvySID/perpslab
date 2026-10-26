# dreamDEX Perps Builder Bounty: Feedback

Reproducible reports for dreamDEX perps on Somnia Tokyo testnet (Hideki, chain 50383). One issue per file in [`feedback/`](.). All re-verified 2026-10-26. Write paths were tested only by simulation on our own linked accounts.

| # | Issue | Area | Severity |
|---|---|---|---|
| 01 | perp-starter swaps TP/SL for shorts | SDK | major |
| 02 | perp-starter manages existing position with wrong side | SDK | major |
| 03 | perp bots crash when market goes close-only | SDK | major |
| 04 | DRY_RUN=0 is half-live | SDK | normal |
| 05 | fetchFundingRateHistory pagination never ends | SDK | major |
| 06 | Quick start symbol BTC/USDSO:USDSO doesn't exist | docs | normal |
| 07 | Paper USDso "blocked" on 6 markets, trades all 21 | docs | normal |
| 08 | OI caps 2-4x too low; per-account cap isn't 1/10 | docs | normal |
| 09 | Operators page links to a 404 repo | docs | normal |
| 10 | Bot kit sizes at touch, sends 20 bps past it | SDK | major |
| 11 | "One-shot reads" sample crashes (WBTC) | docs | normal |
| 12 | SDK docs list stale perp markets | docs | normal |
| 13 | Errors page has no perps errors | docs | normal |
| 14 | Paper USDso is weekly and stacks, not once | docs | normal |
| 15 | Gas per perp order understated several times | docs | normal |
| 16 | hidekiTestnet has no blockExplorers | SDK | normal |
| 17 | Documented self-claim of paper USDso is disabled | docs | major |
| 18 | Voucher eligibility ignores SelfClaimDisabled | SDK | normal |
| 19 | Perp TP/SL fails with bundled Hideki addresses | SDK | normal |
| 20 | Position analytics rounding doesn't match MarginBank | SDK | normal |
| 21 | fetchOHLCV ignores `since` | SDK | normal |
| 22 | fetchPositions dates positions 1970-01-01 | SDK | normal |
| 23 | getMaxPerpOrderSize docs contradict code on gates | SDK | normal |
| 24 | Keyless dry run prints 0-size orders | SDK | normal |
| 25 | perp-guard keyless promises health, prints nothing | SDK | normal |
| 26 | Voucher account can change leverage, docs say it can't | docs | normal |
| 27 | Trader page "Open orders" misses all Tokyo perps orders | app | normal |
| 28 | Logged out, perps links silently land on STT spot | app | normal |
| 29 | dreamBot Builder offers 15 of 21 perps markets | app | normal |
| 30 | SDK Perps page documents unreleased APIs; sample throws | docs | normal |
| 31 | Docs say no backstop bidder; one is registered and active | docs | normal |
| 32 | SDK says Hideki blocks are 10 ms; they are 100 ms | SDK | normal |
| 33 | USDso bridge Shannon → Hideki broken since Oct 7 | contracts | major |
| 34 | SDK docs site: broken edit, deployment and anchor links | docs | normal |

01-04, 10, 24 and 25 are in the official dreamDEX bot kit (github.com/somnia-chain/dreamdex-bot-kit), linked from the perps docs.
