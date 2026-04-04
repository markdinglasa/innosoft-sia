# FEAT-UIX-005 — Offline Status Visualization
## Goal

Make offline and sync behavior visible and understandable.

## Functional Requirements
- Footer/banner sync state
- Unsynced count
- Sync progress visibility
- Retry affordance for failed records

## Acceptance Criteria
- Unsynced queue count visible when relevant
- Sync progress visible after reconnection
- Failed sync items expose retry action

## Components
- SyncFooterBar
- SyncQueueBadge
- SyncFailurePanel