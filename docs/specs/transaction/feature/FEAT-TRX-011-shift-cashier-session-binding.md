# FEAT-TRX-011 — Shift / Cashier Session Binding

## Status
Approved

## Goal
Bind all sales and cash activity to an active shift/session.

## Scope
### In Scope
- open shift
- close shift
- session binding to transaction
- expected cash tracking
- variance support

### Out of Scope
- HR attendance logic

## User Stories
As a business owner, I want every sale and cash movement tied to an active shift.

## Acceptance Criteria
- transactions require active shift/session
- cash movements require active shift/session
- shift close supports reconciliation flow

## Functional Rules
- shift/session is mandatory operational context
- all critical transaction records must reference shift/session

## Test Requirements
- block sale without open shift
- bind sale to shift
- bind cash movement to shift