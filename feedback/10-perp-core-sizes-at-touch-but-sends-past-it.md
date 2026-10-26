# Bot kit sizes orders at the touch but sends them 20 bps past it, so clamped orders revert
Severity: major
Area: SDK

## Steps to reproduce
1. Link a bot key to an app wallet with 1,000 USDso perps margin.
2. `NETWORK=hideki PRIVATE_KEY=<bot> OWNER_ADDRESS=<wallet> PERP_SYMBOL=ETH-PERP PERP_SIDE=long PERP_LEVERAGE=20 PERP_NOTIONAL_USDSO=19900 DRY_RUN=false npx tsx strategies/perp-starter/src/index.ts`

## Expected
When collateral clamps the size, the clamped order is placeable.

## Actual
```
size ceiling is set by collateral (this is not an error on its own)
The contract function "placeOrderFor" reverted.  Error: InsufficientCollateral()
  args: (0xf65E…25B8, true, 0, 2399340000000000000000, 8249800000000000000, ...)
```

## Evidence
The same thing, all in one block (33741984), as `eth_call` from bot `0x742558d9B28A55FEF29b9772D739C9DFAabf57ee` for owner `0xf65EAcaE6AB6cA8a62d7B60Adde4946D3FFf25B8`:
```
ETH best ask 2319.55 | price perp-core sends 2324.18 (+20 bps)
getMaxPerpOrderSize at best ask (what sizeOrder() returns): 8.4207 ETH
placeOrderFor IOC 8.4207 @ best ask  -> OK
placeOrderFor IOC 8.4207 @ ask+20bps -> InsufficientCollateral
getMaxPerpOrderSize at ask+20bps: 8.0115 ETH
```
`sizeOrder()` is given `price: touch`, then `placePerp()` adds 20 bps for takers (`packages/perp-core/src/orders.ts:151-159`). Callers: perp-starter `:126-154`, perp-funding `:131-148`. Fix: size at the slipped price.

## Environment
dreamdex-bot-kit @ 2579866 (markets-sdk 0.31.0) · Node 22.17 · Hideki testnet (50383) · re-checked 2026-10-26
