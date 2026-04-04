# FEAT-UIX-017 — Permission-Aware Action Surfaces

## Goal

Reflect permissions consistently across all UI actions.

## Functional Requirements

- Hide or disable restricted actions based on policy
- Display reason when disabled
- Sync with live permission snapshot
- Shortcut permissions must match visible button permissions

## Acceptance Criteria

- No unauthorized action should be executable through hidden keyboard paths
- Permission-aware rendering must be deterministic and centralized
- Role refresh must update action visibility dynamically

## Components

- PermissionGate
- ActionGuard
- DisabledReasonTooltip