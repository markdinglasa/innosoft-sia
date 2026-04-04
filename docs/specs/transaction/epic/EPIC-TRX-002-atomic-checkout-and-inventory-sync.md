# EPIC-TRX-002 — Atomic Checkout & Inventory Sync

## Epic Goal
Guarantee that checkout, inventory movement, and transaction persistence happen safely and atomically.

## Features
- FEAT-TRX-004 — Atomic Commit & Inventory Ledger
- FEAT-TRX-005 — Receipt / Print / Post-Commit Output Pipeline

## Business Outcome
- No desynced order/payment/stock records
- Reliable inventory balances
- Safe receipt generation

## Risks
- Partial DB writes
- Double commits
- Printer failures blocking checkout
- race conditions on stock

## Implementation Priority
Critical / Phase 2