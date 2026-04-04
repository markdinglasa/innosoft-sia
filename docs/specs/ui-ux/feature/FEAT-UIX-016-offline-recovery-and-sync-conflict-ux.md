# FEAT-UIX-016 — Offline Recovery & Sync Conflict UX
## Goal

- Build user trust in offline-first data safety.

## Functional Requirements
- Distinguish:
    - Saved Locally
    - Synced
    - Sync Failed
- Failed sync queue screen
- Retry and inspect actions
- “Safe to close” guidance when appropriate

## Acceptance Criteria
- Locally saved records must never appear “lost”
- Sync failures must be inspectable and recoverable
- Users must understand what is pending and what is complete

## Components
- SyncQueueScreen
- SyncRecordInspector
- SyncConflictBadge