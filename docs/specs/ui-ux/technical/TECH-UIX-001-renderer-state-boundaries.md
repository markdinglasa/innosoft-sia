# TECH-UIX-001 — Renderer State Boundaries

## Goal

- Define what belongs in Redux vs TanStack Query vs local component state.

## Rule Set

### Redux MUST own:

- session state
- user context
- role/userType context
- active branch / terminal / shift
- in-memory active transaction/cart
- modal orchestration
- hardware status snapshot
- UI mode / shell mode
- shortcut state
- command palette visibility
- sync badge counters
- approval flow state

### TanStack Query MUST own:

- item lists
- customer lists
- supplier lists
- reports
- held order indexes
- transaction history lookups
- receipt history
- config lookups
- reference tables
- sync queue lists (read models)

### Local component state MAY own:

- temporary form values
- open dropdowns
- tab index
- hover states
- uncontrolled animation states

## Hard Rule

- Do NOT place active POS cart lines in TanStack Query.