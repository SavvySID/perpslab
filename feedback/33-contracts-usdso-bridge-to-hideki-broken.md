# USDso bridge Shannon → Hideki is broken since 2026-10-07: quoteGasPayment and every transferRemote revert
Severity: major
Area: contracts

## Steps to reproduce
On Shannon (50312), take the USDso warp router from the SDK (`listBridgeTokens(50312)`): `0x94E2E7f4B2B0a8E3032c7D3ff3c86790BB5979E6`. Its `routers(50383)` is Hideki USDso `0xed7993A74dAe1e6656B704A424DcD8711aAf4F72`, the perps collateral.
1. `quoteGasPayment(50383)`
2. `eth_call` / `debug_traceCall` of `transferRemote(50383, <your address>, 0)` from any address (amount 0, so no balance or approval is needed)
3. List the router's transactions on shannon-explorer.somnia.network

## Expected
Per the SDK docs: "`quoteGasPayment(50383)` returns 0 on both Shannon routers, so the call pays no bridge fee" (`/contracts`), "Send USDso and STT to Hideki from Shannon through the bridge" (`typescript/reference/networks-and-endpoints`), and the transfer succeeds.

## Actual
```
quoteGasPayment(50383): REVERTS        (the 9 other routers in listBridgeTokens: 0, hook 0x0)
transferRemote(50383, self, 0) trace, block 524597562:
CALL router 0x94e2…79e6 transferRemote                        ERROR EXECUTION_REVERTED
  CALL USDso 0x9c32…b171 transferFrom                         ok
  CALL mailbox 0xf805…54f9 dispatch                           ERROR EXECUTION_REVERTED
    STATICCALL 0xa713…e87c quoteDispatch / CALL postDispatch  ok
    CALL hook 0xf11c364da4b5e22b3040be8ea77dccdbfd1277de postDispatch   ERROR EXECUTION_REVERTED
```
Router history:
```
2026-10-22T22:36Z transferRemote error  0xf473711fc5b58958257264fd52818bc0301c15060b74f081b24f548e7460a4d5
2026-10-22T16:21Z transferRemote error  0x4b9f52e28ffcc117bbd12d2e740d482937a733892bff02b965794cd955b12b2e
2026-10-14T10:01Z transferRemote error  0x6c827d6d35f766947194c6049183780328c03ad60ad34bdffe3693e9f0870450
2026-10-07T16:18Z setHook        ok     0xc5259af1b3f7e95b266702638692a7381e9eaa5e168d686dea4ccd1bc8259056
2026-10-07T15:54Z transferRemote ok     0x87e65908e31426f8174d022eaa24f21de208a3f72f86837d73ddc59169aaa818
(earlier transferRemote calls in the history, 2026-10-06, also succeeded)
```

## Evidence
- `setHook` pointed the router at `0xF11C364Da4B5e22b3040be8EA77DccDBfD1277De`. That contract has no `postDispatch`/`quoteDispatch` selectors; it has `handle`, `lastSender`, `lastCallMessage` and `fooBar` (a Hyperlane TestRecipient). The trace shows it is the call that reverts.
- The same docs page says "USDso on Hideki cannot be minted", so this blocks the only documented way to bring your own USDso to the perps chain.
- If the route was disabled on purpose, the docs should say so.

## Environment
Somnia Shannon (50312) RPC https://dream-rpc.somnia.network · explorer API shannon-explorer.somnia.network · eth_call/debug_traceCall only, nothing sent · checked 2026-10-26
