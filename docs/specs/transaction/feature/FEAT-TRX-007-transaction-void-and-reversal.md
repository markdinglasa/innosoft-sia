# FEAT-TRX-007 — Transaction Void & Reversal

## Status
Approved

## Goal
Allow committed transactions to be reversed safely without deleting history.

## Scope
### In Scope
- void request
- reversal transaction creation
- stock restoration
- audit reference
- status update

### Out of Scope
- physical deletion of committed transactions

## User Stories
As a manager, I want to void an existing transaction so that I can correct errors while preserving audit trail.

## Acceptance Criteria
- original transaction is not deleted
- reversal/counter-transaction is created
- stock is restored
- original status becomes VOIDED

## Functional Rules
- void must require authorization
- void reason must be captured
- double-void must be blocked

## Test Requirements
- successful void
- double-void prevention
- stock restoration
- audit linkage