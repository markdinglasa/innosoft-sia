# Implementation Plan: Phase 2 - Transaction Engines (Shift & Calculation)

## Overview
Implement the core transactional lifecycle management by binding all sales activity to an active user shift and providing a centralized calculation engine for taxes, discounts, and residuals. This phase addresses critical operational and accountability gaps in the Transaction domain.

## Requirements
- **Shift Management (FEAT-TRX-011)**: Users must open a shift before creating transactions. Shift tracks starting/ending cash and variance.
- **Calculation Engine (FEAT-TRX-002)**: Real-time calculation of totals, taxes, and discounts within a centralized logic block.
- **Session Enforcement**: Prevent sales activity if no active shift is found for the current user/terminal.

## Architecture Changes
- **New Entity**: `TrnShiftEntity` (Table: `TrnShift`) stores UserId, TerminalId, Status (Open/Closed), Start/End timestamps, and Cash amounts.
- **New Service**: `ShiftService` handles shift lifecycle logic.
- **Service Integration**: Add `checkActiveShift` guard to `BaseService` (or specifically for Transaction services).
- **New Shared Logic**: `src/shared/utils/calculation.ts` for unified math.

## Implementation Steps

### Phase 2.1: Shift Management Foundation (Step 3)
1. **Create TrnShift Entity** (File: `src/main/entities/transactions/TrnShift.entity.ts`)
   - Action: Define columns for session tracking (CashIn, CashOut, ExpectedCash).
2. **Implement ShiftService** (File: `src/main/services/transaction.services/shift.service.ts`)
   - Action: Implement `openShift`, `closeShift`, and `getCurrentShift` methods.
3. **Shift IPC Handlers** (File: `src/main/ipcMain/shiftIpc.ts`)
   - Action: Register `shift-open`, `shift-close` and `shift-status`.
4. **Shift Guard Integration** (File: `src/main/services/base.service.ts`)
   - Action: Implement a hook or method to prevent saving if shift is closed for transaction-type entities.

### Phase 2.2: Real-time Calculation Engine (Step 4)
5. **Unified Calc Utility** (File: `src/shared/utils/calculation-engine.ts`)
   - Action: Logic for Item Total = Price * Qty, DiscountedPrice = Total - Discount, TaxedAmount = DiscountedPrice + Tax.
6. **Integrate Calculation in OrderService** (File: `src/main/services/transaction.services/order.service/order.service.ts`)
   - Action: Recalculate totals server-side during `create` to ensure integrity.
7. **FE-BE Calculation Mirroring**:
   - Ensure the Renderer uses the same shared math logic to avoid "cent discrepancies".

## Testing Strategy
- **Unit Tests**:
  - `ShiftService.test.ts`: Test multiple shift opens, closing with variance.
  - `calculation.test.ts`: Validate complex tax scenarios (Inclusive vs Exclusive).
- **Integration Tests**:
  - Block `Order.create` if `ShiftService.getCurrentShift()` returns null.

## Risks & Mitigations
- **Risk**: Shift management adds friction to the user.
  - Mitigation: Auto-open shift during login (with prompt) via optional configuration.
- **Risk**: Calculations differences between Renderer (Float64) and DB (Decimal).
  - Mitigation: Always round to 5 decimal places during transit and 2 for display.

## Success Criteria
- [ ] Shift must be opened before "Add to Cart" or "Tender" works.
- [ ] Shift Close report generates total expected cash.
- [ ] All transaction totals match the calculation engine's output.
- [ ] Shift history is audited correctly.
