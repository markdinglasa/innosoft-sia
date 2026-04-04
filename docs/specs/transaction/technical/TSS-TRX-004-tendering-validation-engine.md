# TSS-TRX-004 — Tendering Validation Engine

## Purpose
Validate payment lines and settlement integrity before commit.

## Rules
- payment amount must be > 0
- pay type must exist and be active
- required metadata must be present for configured payment types
- split total must match payable amount unless partial mode is supported
- change must only apply to eligible payment types

## Required Tests
- invalid pay type
- exact settlement
- overpayment with cash change
- non-cash payment missing reference
- split mismatch rejection