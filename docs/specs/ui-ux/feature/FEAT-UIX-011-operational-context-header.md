# FEAT-UIX-011 — Operational Context Header
## Goal

- Always display current operational context.

## Must Display
- Current User
- UserType
- Role
- Branch
- Terminal
- Business Date
- Shift Status
- Printer Status
- Sync Status

## Acceptance Criteria
- Header visible in all operational shells
- Business Date mismatch must be visually highlighted
- Shift-locked state must be obvious before attempting checkout

## Components
- OperationalHeader
- BusinessDateBadge
- ShiftStatusBadge