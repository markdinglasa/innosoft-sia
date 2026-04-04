# TSS-TRX-003 — Inventory Deduction & Ledger

## Purpose
Define stock deduction behavior and inventory ledger generation.

## Rules
- stock must be branch-specific
- package/UOM must convert to base inventory unit
- composite/BOM deduction must be supported if enabled
- inventory ledger must be written before stock balance finalization is considered complete
- allowNegativeStock must be branch-configurable

## Safety Rule
Stock validation and deduction must happen inside the same DB transaction as the sale commit.

## Risks
- overselling
- incorrect package factor deduction
- ledger/stock desync

## Required Tests
- package barcode stock deduction
- branch stock isolation
- negative stock rejection
- BOM stock deduction