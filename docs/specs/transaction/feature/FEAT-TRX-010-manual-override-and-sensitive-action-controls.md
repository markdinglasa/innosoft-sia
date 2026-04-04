# FEAT-TRX-010 — Manual Override & Sensitive Action Controls

## Status
Approved

## Goal
Require explicit authorization for restricted transactional actions.

## Scope
### In Scope
- price override
- discount override
- negative stock override
- void approval
- reprint approval
- manager PIN authorization

### Out of Scope
- user role administration

## User Stories
As a system, I want restricted actions to require authorization.

## Acceptance Criteria
- restricted actions require permission or approval
- approval reason is captured
- denied approval keeps action blocked
- override events are auditable

## Functional Rules
- override approval must not silently elevate session rights
- authorization must be explicit and scoped to action

## Test Requirements
- unauthorized attempt
- approved override
- denied override
- audit logging