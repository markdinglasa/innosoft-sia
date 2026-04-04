# FEAT-TRX-008 — Cash Drawer & Petty Cash

## Status
Approved

## Goal
Track all non-sale cash movements tied to shift accountability.

## Scope
### In Scope
- beginning cash
- cash in
- cash out
- payout
- drop
- shift adjustment

### Out of Scope
- sales tendering

## User Stories
As a cashier, I want to record non-sale cash movements so my drawer can reconcile properly.

## Acceptance Criteria
- beginning cash is required at shift start
- cash out requires reason
- X-Read expected cash reflects movements

## Functional Rules
- all movements must be tied to shift/session
- all movements must be auditable

## Test Requirements
- beginning cash save
- payout reduces expected cash
- required reason validation