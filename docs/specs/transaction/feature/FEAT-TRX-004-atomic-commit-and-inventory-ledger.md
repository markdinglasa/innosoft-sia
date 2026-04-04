# FEAT-TRX-004 — Atomic Commit & Inventory Ledger

## Status
Approved

## Goal
Persist the entire transaction in one atomic DB transaction.

## Scope
### In Scope
- order header save
- order line save
- payment save
- discount snapshot save
- tax snapshot save
- inventory ledger save
- stock update
- audit event creation

### Out of Scope
- print formatting
- UI receipt rendering

## User Stories
As a system, I want to save order, collection, and inventory updates in one atomic transaction.

## Acceptance Criteria
- all related records save together
- any failure causes rollback
- successful commit clears current draft
- system datetime and business date are both stored

## Functional Rules
- main process revalidates totals and pricing
- stock validation must happen inside the transaction
- duplicate commit detection should exist

## Technical Rules
- all saves must be wrapped in one DB transaction
- no partial success allowed

## Test Requirements
- rollback on inventory failure
- rollback on invalid payment
- duplicate commit prevention
- stock deduction integrity