# Bot kit sizes orders at the touch but sends them 20 bps past it, so clamped orders revert
Severity: major
Area: SDK

## Steps to reproduce
1. Link a bot key to an app wallet with 1,000 USDso perps margin.
2. `NETWORK=hideki PRIVATE_KEY=<bot> OWNER_ADDRESS=<wallet> PERP_SYMBOL=ETH-PERP PERP_SIDE=long PERP_LEVERAGE=20 PERP_NOTIONAL_USDSO=19900 DRY_RUN=false npx tsx strategies/perp-starter/src/index.ts`

## Expected
The "clamped" size is placeable.

## Actual
```
size ceiling is set by collateral (this is not an error on its own)
The contract function "placeOrderFor" reverted.  Error: InsufficientCollateral()
  args: (0xf65E…25B8, true, 0, 2399340000000000000000, 8249800000000000000, ...)
```

## Evidence
Same account, same block 30344092, `getMaxPerpOrderSize`:
- at best ask 2394.82: max **8.2414** ETH
- at sent price 2399.6 (+20 bps): max **7.9141** ETH

`sizeOrder()` gets `price: touch`, then `placePerp()` adds slippage (`packages/perp-core/src/orders.ts:151-159`). Callers: perp-starter `:132-154`, perp-funding `:136-148`. Fix: size at the slipped price.

## Environment
dreamdex-bot-kit @ 2579866 (markets-sdk 0.31.0) · Node 22.17 · Hideki testnet (50383) · bot `0x742558d9B28A55FEF29b9772D739C9DFAabf57ee`
