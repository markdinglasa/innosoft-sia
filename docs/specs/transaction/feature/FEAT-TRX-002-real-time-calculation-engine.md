# FEAT-TRX-002 — Real-Time Calculation Engine

## Status
Approved

## Goal
Calculate order totals deterministically and instantly.

## Scope
### In Scope
- unit price resolution
- quantity multiplication
- line discount application
- tax calculation
- transaction discount application
- subtotal/net/payable computation

### Out of Scope
- final authoritative commit trust
- external tax service integration

## User Stories
As a cashier, I want to see subtotal, tax, and total in real-time.

## Acceptance Criteria
- quantity changes recalculate totals instantly
- inclusive tax derives correctly
- item-level discount applies before transaction-level discount
- rounding policy is consistent

## Functional Rules
- internal precision: 4 decimals
- display precision: 2 decimals
- final tender rounding applied only at settlement stage

## Technical Rules
- renderer and main process must use the same calculation contract
- main process must recompute before commit

## Test Requirements
- inclusive vs exclusive tax
- multiple discounts
- rounding edge cases
- tax-exempt item handling

## Agent Constraints
- never silently change rounding logic
- never silently change tax order of operations