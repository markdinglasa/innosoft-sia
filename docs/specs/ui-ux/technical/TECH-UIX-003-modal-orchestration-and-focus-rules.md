# TECH-UIX-003 — Modal Orchestration & Focus Rules

## Goal

- Prevent modal chaos in a keyboard/scanner-heavy POS app.

## Rules

- Only one blocking modal at a time
- Nested modal usage discouraged
- Every modal must declare:
    - captureScanner?: boolean
    - captureShortcuts?: boolean
    - restoreFocusTarget?: string

## Modal Classes

- Informational
- Action
- Approval
- Payment
- Protected Input

## Hard Rule

- A modal must never accidentally swallow a barcode scan unless explicitly intended.