# UI/UX Implementation Rules

## Purpose
This file defines **non-negotiable implementation rules** for the renderer layer.

All agents and developers must follow these rules when building or modifying the UI.

---

# 1. Frontend Architecture Rules

## 1.1 UI must not contain business logic
The renderer may:
- collect input
- display state
- trigger actions
- optimistically reflect safe UI changes

The renderer must NOT:
- compute authoritative pricing rules
- finalize permissions
- validate accounting integrity
- trust sensitive totals from client-only state

Authoritative business logic must live in:
- main process services
- transaction engine
- validated IPC handlers

---

## 1.2 No direct Electron API usage in React components
All Electron functionality must flow through:

`Renderer UI -> App Service / Hook -> Preload Bridge -> IPC -> Main Process`

Forbidden:
- `window.require`
- direct filesystem calls from React
- direct DB calls from React
- direct printer access from components

---

## 1.3 No route-level permission assumptions
Routes must never assume access based only on visible menus.

Every protected route must use:
- session validation
- UserType validation
- role permission validation

Hidden menu != secured route

---

# 2. State Management Rules

## 2.1 Redux is for long-lived app state only
Use Redux for:
- auth session
- current user identity
- current branch
- terminal context
- UI shell state
- hardware state snapshot
- active modal registry
- active workspace mode
- persistent settings/preferences

Do NOT use Redux for:
- fetched table rows from CRUD lists
- masterfile lookup pages
- report fetch payloads
- one-off forms unless globally needed

These belong to **TanStack Query** or local component state.

---

## 2.2 TanStack Query is the source of truth for async data
Use TanStack Query for:
- masterfile lists
- masterfile details
- reports
- audit logs
- permissions payload fetches
- settings fetches
- transaction history lists
- printer/test capability reads if polled

Must use:
- query keys
- invalidation after save/update/delete
- stale time definitions
- retry strategies based on operation criticality

---

## 2.3 Active POS cart is not ordinary page state
The active transaction/cart must be treated as a **special domain state**.

Rules:
- it must be resilient to re-renders
- it must not be lost during navigation mistakes
- it must not be recomputed from arbitrary UI fields
- it must be protected from duplicate submission

Recommended:
- isolate active POS state in a dedicated transaction store slice
- all cart mutations go through transaction actions only

---

# 3. Layout Rules

## 3.1 Layout must adapt by UserType
Static UserTypes:
- `Administrator`
- `Cashier`
- `Teller`

Each UserType must load a specialized shell layout.

### Administrator
Prioritize:
- masterfiles
- reports
- inventory
- settings
- dense data views

### Cashier
Prioritize:
- order recall
- payment settlement
- drawer tools
- receipt lookup
- quick tender tools

### Teller
Prioritize:
- item tiles
- categories
- modifiers
- cart builder
- send/suspend actions

---

## 3.2 Role permissions refine visibility, not shell identity
UserType determines **base workspace**.

Role permissions determine:
- which buttons are shown
- which actions are enabled
- which routes inside the workspace are accessible

Example:
- Two Cashiers may share the same shell
- But only one may have:
  - refund
  - discount override
  - payout access

---

# 4. Component Rules

## 4.1 Components must be split into 3 layers
Preferred structure:

- **Page**
  - route-level orchestration
- **Feature Components**
  - business-oriented UI blocks
- **UI Components**
  - reusable design primitives

Avoid giant pages containing:
- fetch logic
- permission logic
- keyboard handling
- modal orchestration
- render logic all in one file

---

## 4.2 MUI must be wrapped where consistency matters
Use wrapper components for repeated patterns:

- `AppDialog`
- `AppDrawer`
- `AppTable`
- `AppPageHeader`
- `PermissionButton`
- `ConfirmActionDialog`
- `StatusChip`
- `EmptyStateCard`
- `OfflineBanner`

This ensures:
- consistent behavior
- consistent styling
- easier agent-safe reuse

---

# 5. Feedback Rules

## 5.1 Every critical action must have visible feedback
Examples:
- save
- delete
- charge
- hold
- void
- print
- sync
- retry
- export

Feedback may be:
- loading spinner
- inline progress
- success toast
- blocking confirmation
- non-blocking warning
- retry banner

Silent failures are forbidden.

---

## 5.2 Never rely only on color
Errors, warnings, and success states must include:
- icon
- label/text
- optional color

Reason:
- accessibility
- operational clarity
- dim retail environments

---

## 5.3 Toasts are not enough for critical failure
Use dialogs or persistent banners for:
- failed checkout
- printer unavailable before receipt flow
- sync backlog overflow
- invalid session
- authorization required
- business date mismatch

---

# 6. Interaction Rules

## 6.1 Keyboard-first support is mandatory
The following must work without a mouse:

- scan item
- search item
- move cart selection
- adjust quantity
- apply discount (if allowed)
- suspend/hold
- charge/pay
- confirm tender
- open command palette
- navigate common POS actions

---

## 6.2 Global barcode capture must be isolated
Barcode capture must:
- not interfere with normal text inputs
- not inject partial scans into random fields
- support wedge scanners
- debounce based on scanner cadence

Must support:
- route-aware scan behavior
- modal-aware exceptions
- explicit “input-locked” contexts

---

## 6.3 Double-submit protection is mandatory
Buttons for sensitive actions must prevent repeated firing:

Examples:
- Charge
- Save
- Void
- Retry Sync
- Print Final Receipt

Methods:
- disable during mutation
- idempotency token where needed
- local action lock

---

# 7. Accessibility Rules

## 7.1 Must support high-contrast mode
Must support:
- stronger contrast
- larger text scale
- visible focus rings
- larger click/touch targets

---

## 7.2 Focus states are required
All interactive controls must have visible keyboard focus.

Forbidden:
- invisible focus states
- click-only workflows

---

# 8. Performance Rules

## 8.1 POS interactions must feel immediate
Target:
- cart update visual feedback under 100ms
- route transitions under 200ms perceived
- keyboard command response under 100ms
- no heavy blocking animations during scan workflows

---

## 8.2 Large lists must use virtualization
Required for:
- item lists
- report tables
- transaction history
- receipt history
- masterfile tables above threshold

---

# 9. Error Handling Rules

## 9.1 Error messages must be operator-readable
Bad:
- `Unhandled Exception`
- `SQL Error 2627`

Good:
- `This SKU already exists.`
- `Printer is not available.`
- `You do not have permission to void this transaction.`

---

## 9.2 Validation errors must map field-by-field
Forms must:
- show field-level errors
- preserve user input where safe
- not wipe the form on validation failure

---

# 10. Audit-Sensitive UI Rules

## 10.1 Sensitive actions must never feel casual
Actions like:
- void
- manager override
- shift close
- payout
- reprint official receipt
- discount override
- price override

Must use:
- explicit confirmation
- reason input if required
- permission check
- audit-friendly UX copy

No “accidental one-click destruction” allowed.