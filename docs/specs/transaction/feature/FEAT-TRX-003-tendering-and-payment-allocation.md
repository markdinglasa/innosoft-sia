# FEAT-TRX-003 — Tendering & Payment Allocation

## Status
Approved

## Goal
Support settlement of transactions using one or more payment methods.

## Scope
### In Scope
- cash
- split tender
- card
- e-wallet
- exact amount
- overpayment/change
- payment metadata

### Out of Scope
- external payment gateway implementation

## User Stories
As a cashier, I want to accept one or more payment methods so that I can settle the sale correctly.

## Acceptance Criteria
- remaining balance updates instantly
- split tender tracks exact amounts
- insufficient payment blocks settlement unless partial mode is supported
- non-cash payments may require reference data

## Functional Rules
- only active pay types may be used
- change should only be allowed for eligible payment methods
- payment total must match payable total unless partial mode is explicitly enabled

## Test Requirements
- split tender
- cash change
- invalid pay type
- insufficient settlement
- required reference validation