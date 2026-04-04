# FEAT-UIX-012 — Operational State Feedback
## Goal

- Make loading, stale, empty, and failure states explicit.

## Functional Requirements
- Skeleton loaders
- Empty-state components
- Stale cache indicators
- Retryable fetch errors
- Preserve last-good-data when possible

## Acceptance Criteria
- No blank or confusing screens
- Query refresh must not destroy current usable state
- Error states must explain what failed and what can be retried

## Components
- SmartDataStateBoundary
- QueryErrorPanel
- RefreshingIndicator