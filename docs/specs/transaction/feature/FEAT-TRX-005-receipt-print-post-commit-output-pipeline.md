# FEAT-TRX-005 — Receipt / Print / Post-Commit Output Pipeline

## Status
Approved

## Goal
Generate transaction outputs safely after successful commit.

## Scope
### In Scope
- customer receipt
- print payload generation
- printer dispatch
- reprint
- print logs

### Out of Scope
- checkout persistence logic

## User Stories
As a cashier, I want a receipt generated after checkout.

## Acceptance Criteria
- receipt payload is generated after successful commit
- print can auto-run based on config
- printer failure does not invalidate sale
- reprint requires authorization if configured

## Functional Rules
- printing is post-commit only
- every print attempt must be logged

## Test Requirements
- receipt generation
- printer failure fallback
- reprint behavior
- print log creation