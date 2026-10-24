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
