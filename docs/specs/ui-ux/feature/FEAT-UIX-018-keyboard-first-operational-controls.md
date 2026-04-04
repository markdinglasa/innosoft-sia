# FEAT-UIX-018 — Keyboard-First Operational Controls

## Goal

Support high-speed keyboard workflows for front-line operations.

## Functional Requirements

- Shortcut registry
- Conflict-safe key map
- Context-aware shortcuts
- Permission-aware execution

## Suggested Defaults

- F2 Search
- F4 Hold
- F6 Customer
- F8 Discount
- F9 Charge
- Esc Close / Cancel
- Enter Confirm
- Ctrl+K Command Palette

## Acceptance Criteria

- Major cashier actions must be reachable by keyboard
- Shortcut handling must be disabled inside protected input contexts where appropriate
- Unauthorized shortcuts must fail gracefully with feedback