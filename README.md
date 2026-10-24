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

## Project Structure

- `dreamperps/` — SDK integration: market reads and order placement.
- `feedback/` — Reproducible feedback reports.
- `app/` — Perps MVP application.
- `tests/` — Integration tests and experiments.

## Network

Somnia Tokyo Testnet (chain ID 50383)

## Status

Under development.

Features and test results will be documented as they are implemented and verified.
