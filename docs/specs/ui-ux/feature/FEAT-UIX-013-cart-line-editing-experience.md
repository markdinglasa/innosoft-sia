# FEAT-UIX-013 — Cart Line Editing Experience
## Goal

- Make cart line adjustments fast, visible, and safe.

## Functional Requirements
- Quantity increment/decrement
- Manual quantity entry
- Remove line
- Line discount
- Notes/modifiers
- UOM/package switching
- Visual badges for modified lines

## Acceptance Criteria
- Every editable cart line action must be accessible in ≤2 interactions
- Dangerous edits must respect permission and approval rules
- Modified lines must be visually obvious

## Components
- CartLineActions
- CartLineEditor
- LineMetaBadges