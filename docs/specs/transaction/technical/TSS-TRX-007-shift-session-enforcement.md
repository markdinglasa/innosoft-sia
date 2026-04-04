# TSS-TRX-007 — Shift Session Enforcement

## Purpose
Ensure all operational transaction actions are tied to a valid active shift.

## Rules
- sale commit requires active shift/session
- cash movement requires active shift/session
- held orders should carry shift/session metadata
- shift close should enforce unresolved operational policy

## Required Tests
- block sale without shift
- block payout without shift
- shift linkage persistence