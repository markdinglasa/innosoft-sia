# EPIC — Authorization-Aware UI

## Epic ID
EPIC-UTUI-002

## Title
Permission-Aware Navigation and Action Visibility

## Objective
Ensure UI behavior respects Role-based permissions while preserving UserType-specific workflows.

## Description
Even inside the correct workspace, users must only see and access what their Role permits.

This epic defines:
- route guarding
- menu visibility
- action availability
- permission-aware components

## Included Features
- FEAT-UTUI-005 — Permission-Aware Actions
- FEAT-UTUI-004 — Workspace Routing & Landing

## Success Criteria
- unauthorized screens are blocked
- unauthorized actions are hidden or disabled consistently
- permission checks are deterministic and centralized