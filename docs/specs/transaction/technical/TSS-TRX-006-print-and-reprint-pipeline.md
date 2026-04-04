# TSS-TRX-006 — Print & Reprint Pipeline

## Purpose
Define the post-commit print lifecycle.

## Rules
- receipt generation happens after successful commit
- print failure must not rollback sale
- all print attempts must be logged
- reprint may require authorization depending on policy

## Required Outputs
- customer receipt
- cashier copy
- kitchen/bar ticket if applicable
- reprint copy

## Required Tests
- successful print dispatch
- printer failure fallback
- reprint authorization
- print log creation