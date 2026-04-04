# EPIC — Workspace Shells

## Epic ID
EPIC-UTUI-001

## Title
UserType-Based Workspace Shells

## Objective
Provide specialized operational workspace shells based on static UserType.

## Description
Different users perform fundamentally different work inside the POS system.

This epic defines dedicated workspaces for:
- Administrator
- Cashier
- Teller

Each workspace must optimize:
- screen priority
- navigation structure
- action placement
- workflow speed
- information density

## Business Value
This reduces:
- operational mistakes
- clutter
- training friction
- role confusion
- unauthorized or accidental actions

## Included Features
- FEAT-UTUI-001 — Administrator Workspace
- FEAT-UTUI-002 — Cashier Workspace
- FEAT-UTUI-003 — Teller Workspace
- FEAT-UTUI-004 — Workspace Routing & Landing

## Out of Scope
- transaction engine internals
- role masterfile CRUD
- permission master data definition

## Success Criteria
- each UserType loads into correct workspace shell
- each workspace prioritizes role-appropriate tasks
- workspaces remain separate and maintainable