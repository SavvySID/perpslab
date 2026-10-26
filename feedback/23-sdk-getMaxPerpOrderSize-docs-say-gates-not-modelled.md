# getMaxPerpOrderSize docs say close-only and isolated gates are "not modelled", but the code models them
Severity: normal
Area: SDK

## Steps to reproduce
Read the `getMaxPerpOrderSize` docblock and PERPS.md, then the implementation, in @somnia-chain/markets-sdk 0.32.1.

## Expected
One consistent statement of what `getMaxPerpOrderSize` checks.

## Actual
The docs say the two gates are not modelled:
- `src/perp/margin.ts:2729-2734`: "Two placement gates outside the margin path are not modelled either ... this returns a size every increasing order then bounces. Check `isRestricted()` alongside this read until they are folded in."
- `docs/PERPS.md:163-165`: "Nor are the two non-margin gates ...: a close-only market (`PerpPool.isRestricted()`) and isolated-margin confinement."

But the code models both:
- `readPerpPlacementState` reads `isRestricted` and `isolationAllowsMarket` (`margin.ts:2363-2364`).
- `perpOrderMarginQuote` sets `restrictedBlocked` / `isolationBlocked` (`:2190-2191`) and folds them into `sufficient` (`:2301-2302`).
- `getMaxPerpOrderSize` returns `limitedBy: "isolated"` / `"restricted"` (`:2874-2875`), and the result type lists both (`:2576-2581`).
- The same PERPS.md section, a few lines on (`:177-178`), says `"restricted"` and `"isolated"` name those two gates.

Integrators are told to add a redundant `isRestricted()` check and to distrust a result that already accounts for it.

## Evidence
Line references above. Neither gate is active on Hideki today (no restricted pool; no isolated account among 1,135 position holders), so the docs text is the defect.

## Environment
@somnia-chain/markets-sdk 0.32.1
