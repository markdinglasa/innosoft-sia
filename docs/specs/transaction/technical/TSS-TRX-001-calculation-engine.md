# TSS-TRX-001 — Calculation Engine

## Purpose
Define the deterministic pricing, discount, tax, and rounding engine used by both renderer preview and main-process validation.

## Core Formula Order
1. Resolve unit price
2. Multiply by quantity
3. Apply line-level discounts
4. Compute taxable base
5. Compute tax
6. Compute line net
7. Aggregate subtotal
8. Apply transaction-level discounts
9. Recompute final payable
10. Apply tender rounding if configured

## Precision Rules
- internal precision: 4 decimals
- display precision: 2 decimals
- final tender precision: 2 decimals
- optional branch cash rounding allowed only at final tender stage

## Required Inputs
- item base price
- branch tax mode
- line discounts
- transaction discounts
- item taxability
- branch rounding settings

## Hard Rules
- renderer and main process must use the same deterministic rules
- main process is authoritative
- no floating business rules hidden inside UI components

## Required Tests
- inclusive/exclusive tax
- stacked discounts
- edge-case decimals
- zero tax item
- tax exempt transaction