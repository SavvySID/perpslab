# Perp TP/SL can't be placed with the documented SDK setup: NotConfiguredError (no operator registry in SOMNIA_HIDEKI_TESTNET_ADDRESSES)
Severity: normal
Area: SDK

## Steps to reproduce
Connect exactly as /docs/developers/perps-testnet shows (`addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES`, a private key), then:
```js
const btc = (await markets.client.listPerpMarkets()).find((m) => m.baseSymbol === "BTC")
const p = { registry: btc.stopRegistry, pool: btc.poolAddress, isBid: false, quantity: 13_000n,
            triggerPrice: 90_000_000_000_000_000_000n, triggerOperator: 1, stopOrderType: 1 }
await markets.trader.buildPlacePerpStopOrder(p)   // the docblock's own example shape
await markets.trader.placePerpStopOrder(p)         // any account that hasn't granted the registry yet
```

## Expected
A stop order (or its unsigned calls) is returned.

## Actual
```
SOMNIA_HIDEKI_TESTNET_ADDRESSES.operatorPermissionsRegistry = undefined
build: NotConfiguredError - a perp stop order — needs operatorRegistry or addresses.operatorPermissionsRegistry
send:  NotConfiguredError - a perp stop order — needs operatorRegistry or addresses.operatorPermissionsRegistry
build with operatorRegistry: "0x6B2FbfeD328FF5F20C0BE7D3C3437613aFFE8D3a" -> OK [stopOrder, operatorApproval]
```

## Evidence
- `src/perp/stops.ts:772-776` (`operatorGrantCall`) falls back to `addresses().operatorPermissionsRegistry`, which none of the bundled address sets define (Hideki, Shannon, mainnet).
- Every Hideki pool returns `getOperatorPermissionsRegistry()` = `0x6B2FbfeD328FF5F20C0BE7D3C3437613aFFE8D3a`, the address the perps docs list.
- The bot kit hard-codes the same address to work around this (`packages/perp-core/src/config.ts:75-81`, "It is NOT in the SDK's bundled address sets").

Fix: add it to `SOMNIA_HIDEKI_TESTNET_ADDRESSES`, or resolve it from the pool.

## Environment
@somnia-chain/markets-sdk 0.32.1 · Node 22.17 · Hideki testnet (50383) · fresh unfunded key, build path (nothing sent)
