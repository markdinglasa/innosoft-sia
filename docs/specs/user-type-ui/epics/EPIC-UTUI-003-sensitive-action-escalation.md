# EPIC — Sensitive Action Escalation

## Epic ID
EPIC-UTUI-003

## Title
Sensitive Action Authorization and Mode Switching

## Objective
Allow secure escalation and temporary operational switching without compromising auditability or security.

## Description
Certain actions may be attempted by users who do not have permission, but can still be allowed with manager authorization.

This epic defines:
- manager override approval
- authorization PIN flow
- temporary mode switching (where allowed)
- context preservation across workspace switches

## Included Features
- FEAT-UTUI-006 — Manager Override Approval
- FEAT-UTUI-007 — Mode Switching & Context Preservation

## Success Criteria
- sensitive actions require secure approval
- override actions are auditable
- mode switching is explicit and controlled