# UI/UX State Architecture

## Purpose
This document defines the official state boundaries for the renderer.

The goal is to prevent:
- state duplication
- stale UI behavior
- unsafe transaction memory
- misuse of Redux and TanStack Query

---

# 1. State Philosophy

Use the right tool for the right type of state.

## Rule of thumb

### Use Redux when the state is:
- global
- persistent across routes
- session-related
- UI shell related
- interaction-driven
- not naturally server/query owned

### Use TanStack Query when the state is:
- fetched from main process / DB-backed services
- cacheable
- invalidatable
- refreshable
- list/detail/report-oriented

### Use local component state when the state is:
- temporary
- visual only
- form-local
- modal-local
- ephemeral UI interaction

---

# 2. Official Redux Domains

## 2.1 `authSlice`
Purpose:
- authenticated user identity
- login status
- session lifecycle snapshot
- current branch context
- current terminal context
- current UserType
- loaded role permissions summary

Examples:
- `userId`
- `username`
- `userType`
- `roleId`
- `branchId`
- `terminalId`
- `sessionExpiresAt`
- `isAuthenticated`

---

## 2.2 `appShellSlice`
Purpose:
- app-wide UI shell behavior

Examples:
- sidebar collapsed state
- current workspace mode
- command palette open
- theme mode
- accessibility mode
- current layout density
- app-level banners

---

## 2.3 `hardwareSlice`
Purpose:
- renderer-visible hardware snapshot

Examples:
- printer status
- scanner readiness
- cash drawer availability
- last printer error
- receipt printer selected

Important:
This is **display state only**, not device control authority.

---

## 2.4 `transactionShellSlice`
Purpose:
- active transaction shell state that must survive UI changes safely

Examples:
- current cart lines
- selected cart line
- active customer
- active order mode
- pending discounts
- draft note
- hold/recall UI state
- tender modal state

This slice must remain carefully scoped and not become a dumping ground.

---

## 2.5 `modalSlice` (optional)
Purpose:
- centralized modal orchestration for global dialogs

Examples:
- manager authorization modal
- printer issue modal
- force logout modal
- stale session warning modal

Use only if modal complexity justifies it.

---

# 3. Official TanStack Query Domains

## 3.1 Masterfiles
Examples:
- items
- customers
- suppliers
- branches
- users
- roles
- taxes
- terminals
- payment methods
- discounts

Recommended query key style:
- `['items', filters]`
- `['item', itemId]`
- `['customers', filters]`

---

## 3.2 Reports
Examples:
- sales summary
- cashier x-read
- z-read
- inventory movement
- audit logs

Recommended query key style:
- `['report', 'sales-summary', filters]`

---

## 3.3 Transaction History / Lookup
Examples:
- transaction list
- receipt lookup
- suspended orders list
- recall candidates

Recommended query key style:
- `['transactions', filters]`
- `['suspended-orders', branchId]`

---

## 3.4 Settings / Configuration Reads
Examples:
- active terminal settings
- printer mapping
- tax config
- branch operational settings

Recommended query key style:
- `['settings', 'terminal', terminalId]`

---

# 4. What Must NOT Go Into Redux

Forbidden or discouraged:
- full item masterfile table data
- full report results
- fetched CRUD detail records unless specifically required
- export file results
- transient table filters unless globally needed
- duplicated query cache data

Reason:
This causes:
- stale bugs
- unnecessary memory retention
- cache invalidation confusion

---

# 5. Mutation Architecture

## Rule
Mutations must use:
- TanStack Query mutation hooks
- explicit invalidation or cache patching
- user feedback state

Examples:
- create item
- update customer
- save role
- save settings
- hold order
- settle order
- void transaction

---

# 6. POS Transaction State Special Rules

The active transaction is the most fragile renderer state.

## Requirements
It must:
- update instantly
- survive minor UI route changes where intended
- prevent duplicate submit
- remain recoverable if safe
- be reconstructable from a held order or persisted draft

## Rules
- all cart changes must go through explicit transaction actions
- totals shown in UI are “display calculations,” not final accounting authority
- commit success must hard-reset transaction shell safely
- failed commit must preserve cart safely unless instructed otherwise

---

# 7. Suggested Folder Shape

```txt
src/renderer/src/POS/
  store/
    slices/
      auth-slice.ts
      app-shell-slice.ts
      hardware-slice.ts
      transaction-shell-slice.ts
      modal-slice.ts

  selectors/
    auth-selectors.ts
    app-shell-selectors.ts
    hardware-selectors.ts
    transaction-shell-selectors.ts
    modal-selectors.ts
    
  hooks/
    use-permissions.ts
    use-user-type.ts
    use-route-guard.ts
    use-keyboard-shortcuts.ts
    use-barcode-capture.ts
