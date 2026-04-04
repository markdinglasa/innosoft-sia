# FEAT-UIX-003 — Micro-Interaction Feedback
## Goal

- Provide subtle feedback for user confidence without slowing the app.

## Functional Requirements
- Cart line entry animation
- Quantity change pulse
- Payment success animation
- Lightweight toast transitions

## Performance Rule
- Animation budget: <150ms for transactional actions

## Acceptance Criteria
- Item add animation must not block input
- Payment success animation must auto-dismiss quickly
- No layout thrash during animations