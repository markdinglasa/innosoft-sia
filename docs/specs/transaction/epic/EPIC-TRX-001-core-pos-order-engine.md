# EPIC-TRX-001 — Core POS Order Engine

## Epic Goal
Provide a high-speed, reliable, in-memory order building and pricing engine for Teller and Cashier workflows.

## Why This Exists
The POS must feel instant. Scanning, quantity changes, modifier application, and total updates must happen with minimal latency while preserving deterministic calculation behavior.

## Features
- FEAT-TRX-001 — In-Memory Order Management
- FEAT-TRX-002 — Real-Time Calculation Engine
- FEAT-TRX-003 — Tendering & Payment Allocation

## Business Outcome
- Fast order entry
- Accurate totals
- Low cashier friction
- Stable cart behavior under heavy usage

## Risks
- Incorrect line merging
- Rounding drift
- Invalid tax calculations
- Tender mismatch

## Implementation Priority
Critical / Phase 1