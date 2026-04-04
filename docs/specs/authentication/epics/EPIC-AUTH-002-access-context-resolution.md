# EPIC — Access Context Resolution

## Epic ID
EPIC-AUTH-002

## Title
Operational Access Context Resolution

## Objective
Resolve the full operational context required after login.

## Description
Authentication must resolve not just identity, but also:
- UserType
- Role permissions
- branch access
- active branch
- active terminal
- workspace landing behavior

## Included Features
- FEAT-AUTH-003 — User Context Resolution
- FEAT-AUTH-004 — Role and Permission Hydration
- FEAT-AUTH-005 — Branch and Terminal Context

## Success Criteria
- login always results in a complete operational session context
- UI shell selection is deterministic
- permissions are hydrated before protected actions occur