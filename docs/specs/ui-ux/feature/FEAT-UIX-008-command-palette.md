# FEAT-UIX-008 — Command Palette (Ctrl+K)
## Goal

- Provide universal quick navigation and power-user command execution.

## Functional Requirements
- Search routes, entities, actions
- Keyboard navigation
- Role-aware results
- Fast open/close behavior

## Acceptance Criteria
- Ctrl+K opens globally except protected screens if needed
- Results are permission-aware
- Enter executes selected action immediately

## Components
- CommandPalette
- CommandRegistry
- CommandSearchAdapter