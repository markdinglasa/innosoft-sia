# FEAT-TRX-001 — In-Memory Order Management

## Status
Approved

## Goal
Provide a fast renderer-side cart/order engine for transaction building.

## Business Value
Enables instant cashier/teller interaction without waiting for DB round-trips.

## Scope
### In Scope
- add item
- merge duplicate line
- update quantity
- remove line
- notes
- modifiers
- package/UOM resolution
- draft order state

### Out of Scope
- authoritative stock commit
- authoritative tax finalization
- accounting posting

## User Stories
As a cashier, I want to scan a barcode or search for an item so that I can quickly add it to the current transaction.

## Acceptance Criteria
- valid barcode adds item
- duplicate scan increments quantity
- inactive item is blocked
- package barcode resolves correctly
- zero stock warning follows branch policy

## Functional Rules
- order state is local and ephemeral until hold or commit
- line merging must follow item + price + modifier equivalence rules
- cart must support metadata for notes and overrides

## Technical Rules
- renderer store must remain serializable
- use deterministic line IDs
- no direct DB access from renderer

## Test Requirements
- duplicate scan merge
- quantity increment/decrement
- remove line
- package scan mapping
- modifier attachment

## Agent Constraints
- do not rewrite full cart engine
- preserve line merge rules