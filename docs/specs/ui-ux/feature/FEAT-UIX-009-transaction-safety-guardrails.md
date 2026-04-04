# FEAT-UIX-009 — Transaction Safety Guardrails
## Goal

- Prevent high-cost operator mistakes during active selling.

## Functional Requirements
- Double-submit prevention
- High quantity confirmation
- Price override visual flags
- Duplicate scan detection heuristics
- Dangerous cart state warnings

## Acceptance Criteria
- Repeated Charge action must be blocked during pending commit
- Overridden lines must show visual indicators
- High-risk states must prompt for confirmation before finalization

## Components
- DangerStateBanner
- LineOverrideBadge
- CommitLockOverlay