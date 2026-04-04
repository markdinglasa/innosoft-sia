# FEAT-TRX-006 — Suspended Sales (Hold/Recall)

## Status
Approved

## Goal
Allow active orders to be held and recalled later.

## Scope
### In Scope
- hold current draft
- recall held order
- held order listing
- held order metadata
- held order purge/abandon policy

### Out of Scope
- committed sales reporting

## User Stories
As a cashier, I want to put an order on hold so that I can serve the next customer.

## Acceptance Criteria
- hold saves draft state
- recall restores exact state
- held orders are not treated as completed sales
- held orders survive app restart/crash

## Functional Rules
- held orders must not deduct stock
- held orders must not generate journal entries

## Test Requirements
- hold and restore exact cart
- restore discounts and modifiers
- crash persistence