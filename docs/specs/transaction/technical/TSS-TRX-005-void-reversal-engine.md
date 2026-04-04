# TSS-TRX-005 — Void / Reversal Engine

## Purpose
Define how committed transactions are reversed safely.

## Rules
- committed sales must never be deleted
- original transaction must be marked VOIDED
- reversal transaction must reference original transaction
- stock must be restored
- accounting reversal must be created if accounting is enabled
- double-void must be blocked

## Required Tests
- standard void
- double-void prevention
- stock restoration
- reversal linkage integrity