# UI/UX Module Spec (Modern POS)

## Purpose
This module defines the **frontend behavior, structure, state boundaries, interaction rules, and safety constraints** for the POS application renderer.

This is **not just a visual design layer**.

The UI/UX system must function as:

- a **speed layer** for Teller/Cashier workflows
- a **safety layer** for preventing operational mistakes
- a **feedback layer** for offline sync, printer health, and transaction state
- a **permission-aware shell** for UserType + Role-based navigation

---

# Core Goals

1. **Fast**
   - POS actions must feel immediate.
   - Barcode-driven workflows should require minimal pointer usage.
   - Critical actions should complete visually in <100ms where possible.

2. **Safe**
   - Prevent accidental voids, wrong tenders, duplicate submits, and stale screens.
   - Surface permissions clearly.
   - Restrict dangerous actions through explicit UX friction.

3. **Role-Aware**
   - The UI must adapt to the static **UserType**:
     - `Administrator`
     - `Cashier`
     - `Teller`
   - Dynamic **Role permissions** further refine what is visible and actionable.

4. **Offline-Transparent**
   - The UI must always communicate:
     - online/offline status
     - queued sync jobs
     - sync failures
     - local-only saved work

5. **Operationally Trustworthy**
   - Users must always know:
     - what happened
     - what is saving
     - what failed
     - what requires attention

---

# Renderer Tech Stack

## State & Data
- **Redux**
  - global app shell state
  - auth/session state
  - UI preferences
  - active transaction shell state
  - hardware status snapshot
  - modal orchestration
  - route/guard-related session memory

- **TanStack Query**
  - async server/main-process-backed data fetching
  - cached masterfile lookups
  - invalidation on save/update/delete
  - stale/fresh state control
  - background refresh

## UI Framework
- **MUI**
  - layout primitives
  - dialogs
  - tables
  - forms
  - app shell
  - responsive navigation

## Motion / Interaction
- Optional:
  - **Framer Motion** for micro-interactions
  - Lottie only for **rare celebratory or completion moments**
- Motion must never reduce scan speed or input reliability.

---

# UX Design Principles

## 1. Keyboard First
The POS must be fully usable without a mouse for critical workflows.

## 2. Touch Friendly
The POS must remain operable on touch monitors and tablets.

## 3. High Visibility
Financial totals, transaction state, errors, and sync status must be obvious.

## 4. Low Cognitive Load
Do not overload Teller/Cashier screens with admin or accounting noise.

## 5. Progressive Disclosure
Only show advanced tools when relevant and permitted.

---

# Module Boundaries

This UI/UX module covers:

- application shell
- workspace layouts
- route structure
- navigation
- keyboard interactions
- status surfaces
- loading/error/empty states
- transaction UX behaviors
- role-aware visibility
- accessibility rules
- offline & hardware visibility

This module does **NOT** define:

- database schema
- IPC business logic
- pricing/tax formulas
- authentication token internals
- licensing cryptography

Those belong to their own specs.

---

# Linked Specs

- `IMPLEMENTATION_RULES.md`
- `AGENT_CONSTRAINTS.md`
- `STATE_ARCHITECTURE.md`
- `ROUTING_AND_GUARDS.md`
- `KEYBOARD_SHORTCUTS.md`

---

# Success Criteria

The UI/UX layer is considered successful if:

- Teller can create an order with minimal taps/clicks
- Cashier can settle an order without UI friction
- Admin can manage data without POS clutter
- No unauthorized route or action is accessible through UI tricks
- Offline and sync states are always understandable
- Hardware problems are visible before they become operational failures