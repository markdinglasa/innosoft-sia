# UI/UX — COMPONENT PATTERNS
Version: 1.0.0
Owner: Frontend Architecture
Status: Draft
Module: Renderer (Electron + React + Vite)

---

# 1. Purpose

This document defines the **approved component patterns** for the POS renderer.

The goal is to ensure:
- predictable UX behavior
- reusable implementation
- safe AI-generated UI changes
- consistency across Admin / Cashier / Teller experiences

This is a **system-level contract** for UI construction.

---

# 2. Core Principles

## 2.1 POS-First UX
The interface must prioritize:
- speed
- clarity
- low error rate
- low cognitive load

## 2.2 Reuse Before Reinvent
Agents and developers MUST:
- reuse existing shared components first
- extend existing patterns second
- create new patterns only when justified

## 2.3 State-Safe Components
All components must have clear boundaries between:
- presentational state
- form state
- async data state
- global app state

## 2.4 Renderer Safety
Renderer components:
- MUST NOT directly call DB
- MUST NOT directly call Electron APIs
- MUST use hooks / services / IPC bridge only

---

# 3. Component Taxonomy

All renderer components MUST fall into one of these categories.

---

# 4. Component Categories

## 4.1 App Shell Components

Purpose:
Global application structure and workspace framing.

Examples:
- `AppShell`
- `Sidebar`
- `Topbar`
- `FooterStatusBar`
- `WorkspaceLayout`
- `RoleWorkspaceShell`

Rules:
- Must be layout-only
- Must not contain business logic
- May consume auth/session/role state
- Must not fetch heavy module data directly

Allowed:
- navigation
- route rendering
- role-aware menus
- hardware status badges
- sync indicators

Forbidden:
- transaction calculations
- form submission logic
- database calls

---

## 4.2 Page Components

Purpose:
Represent a route-level screen.

Examples:
- `ItemListPage`
- `POSOrderPage`
- `ReportsSalesPage`
- `SettingsTerminalPage`

Rules:
- May orchestrate multiple sections
- May call page-level hooks
- Should remain thin and compositional
- Should not contain deeply embedded business rules

Allowed:
- compose sections
- trigger dialogs
- connect query hooks
- dispatch Redux actions

Forbidden:
- inline giant forms > 300 LOC
- embedded SQL logic
- duplicated fetch logic already available in hooks/services

---

## 4.3 Section Components

Purpose:
Logical subdivisions inside a page.

Examples:
- `CartSidebar`
- `CatalogGrid`
- `PaymentPanel`
- `BranchSettingsSection`
- `PrinterStatusSection`

Rules:
- Focus on one bounded responsibility
- May accept domain-specific props
- Prefer composition over condition-heavy rendering

Allowed:
- local UI state
- event callbacks
- visual grouping

Forbidden:
- hidden cross-module side effects
- deep coupling to unrelated store slices

---

## 4.4 Shared UI Components

Purpose:
Reusable visual building blocks used across modules.

Examples:
- `AppButton`
- `AppDialog`
- `AppDrawer`
- `AppTable`
- `AppTextField`
- `AppSelect`
- `AppDateRangePicker`
- `AppSearchBar`
- `AppStatusChip`
- `AppEmptyState`
- `AppErrorState`
- `AppConfirmDialog`

Rules:
- Must be generic and reusable
- Must support theme and accessibility requirements
- Must not know domain-specific behavior

Allowed:
- style variants
- size variants
- loading state
- icon support

Forbidden:
- module-specific naming like `CashierSaveButton`
- business logic tied to transactions/masterfiles/etc.

---

## 4.5 Feature Components

Purpose:
Domain-aware reusable components tied to a module.

Examples:
- `ItemLookupDialog`
- `DiscountSelectorDialog`
- `TenderBreakdownCard`
- `HeldOrderList`
- `RolePermissionMatrix`
- `BranchAccessEditor`

Rules:
- Can encode module-specific UX behavior
- Should still avoid DB/IPC logic inside component body
- Should rely on hooks/services

Allowed:
- domain-specific validation visuals
- workflow steps
- permission-aware rendering

Forbidden:
- direct SQL
- hardcoded auth bypasses
- giant monolithic file implementations

---

## 4.6 Form Components

Purpose:
Structured data entry components.

Examples:
- `ItemForm`
- `CustomerForm`
- `SupplierForm`
- `DiscountForm`
- `TerminalSettingsForm`

Rules:
- MUST use shared form conventions
- MUST use controlled field abstractions
- MUST use schema-driven validation where applicable

Allowed:
- Formik / RHF / custom controlled integration
- validation state mapping
- child collection editors

Forbidden:
- ad hoc validation strings scattered inline
- save logic tightly coupled to button click without service abstraction

---

## 4.7 Overlay Components

Purpose:
Interruptive or contextual temporary interfaces.

Examples:
- `AppDialog`
- `AppModal`
- `AppPopover`
- `AppCommandPalette`
- `QuickViewModal`
- `ManagerApprovalDialog`

Rules:
- Must be keyboard accessible
- Must support close/escape behavior unless intentionally blocked
- Must clearly define blocking vs non-blocking usage

Allowed:
- confirm actions
- detail preview
- manager overrides
- search actions

Forbidden:
- stacking more than 2 critical blocking modals
- silent destructive action flows

---

# 5. Canonical UI Pattern Library

These are the **approved default patterns**.

---

# 6. List Page Pattern

Use for:
- Items
- Customers
- Suppliers
- Roles
- Branches
- Reports tables

## Standard Structure
1. Page Header
2. Filters / Search Row
3. Table or Grid
4. Empty / Loading / Error states
5. Pagination / Infinite Controls
6. Action Bar (optional)

## Required Behaviors
- search debounce
- sortable columns
- column visibility (optional)
- row click opens detail/edit
- bulk action support where appropriate

## Must Not
- load entire huge dataset into DOM without virtualization
- place destructive actions without confirmation

---

# 7. Master-Detail Pattern

Use for:
- Item editing
- Role permission editing
- Terminal setup
- Order recall details

## Standard Structure
Left:
- list / navigator

Right:
- detail panel / editor

Required:
- unsaved changes guard
- loading skeleton
- save / cancel affordance
- concurrency-safe refresh pattern

---

# 8. Wizard Pattern

Use for:
- onboarding
- activation / licensing
- DB linking setup
- first-time terminal setup

Rules:
- max 1 primary task per step
- show progress
- support validation before next
- allow back navigation unless security-critical

Do not use wizard:
- for fast cashier workflows
- for simple 1-form CRUD

---

# 9. POS Transaction Pattern

Use for:
- Teller / Cashier / POS transaction workspace

## Required Zones
- Product/Catalog Zone
- Search / Scan Zone
- Cart Zone
- Totals Zone
- Action Zone
- Status/Sync/Hardware Zone

## Required UX Principles
- critical actions must be visible without scrolling
- totals must remain pinned
- scan flow must not depend on mouse
- cart modifications must be fast and reversible
- all sensitive actions must surface confirmation or manager auth

---

# 10. Form Pattern Standards

## Standard Form Layout
- Header
- Main Fields
- Child/Related Collections (if applicable)
- Validation Summary (optional)
- Footer Actions

## Field Grouping Rules
Fields must be grouped by:
- identity
- accounting
- operational behavior
- system flags
- child relations

## Required Form Features
- dirty-state detection
- loading disable state
- inline validation
- save success feedback
- conflict handling (outdated data)

## Must Not
- silently fail on submit
- reset form without warning
- hide validation behind generic “something went wrong”

---

# 11. Dialog Pattern Standards

## Dialog Types

### 11.1 Informational
Examples:
- printer offline
- sync complete

### 11.2 Confirmation
Examples:
- delete
- void
- logout

### 11.3 Action Dialog
Examples:
- discount selector
- customer picker
- payment modal

### 11.4 Authorization Dialog
Examples:
- manager PIN
- override approval

## Dialog Rules
- every dialog must have one clear purpose
- dangerous actions must use explicit action labels
- default focus must be intentional
- Enter/Escape behavior must be defined

---

# 12. Table Pattern Standards

Use `AppTable` abstraction.

## Required Features
- loading state
- empty state
- error state
- pagination or virtualization
- row actions
- row selection if applicable

## Table Variants
- DenseTable → Admin-heavy screens
- SelectableTable → bulk operations
- VirtualizedTable → 1000+ rows
- SummaryTable → reports / analytics

## Must Not
- embed complex business logic inside cell renderers
- create custom table behavior per module without reason

---

# 13. Card/Grid Pattern Standards

Use for:
- Teller catalog
- settings cards
- dashboards
- command results

Rules:
- visual hierarchy must be clear
- selection state must be obvious
- disabled/unavailable items must be distinguishable

---

# 14. Search & Lookup Pattern

Use for:
- item lookup
- customer search
- supplier selection
- command palette
- report filter references

Required:
- keyboard navigation
- loading indicator
- no results state
- recently used (where useful)
- clear selected state

---

# 15. Status Visualization Pattern

Use for:
- order states
- sync states
- hardware states
- auth states
- licensing states

Status must never rely on color alone.

Each status indicator must include at least one:
- icon
- label
- tooltip
- badge text

---

# 16. Destructive Action Pattern

Examples:
- deactivate
- void
- remove payment
- delete child row
- clear cart

Required:
- confirmation or undo
- clear explanation
- permission check if sensitive
- audit-safe messaging if applicable

Forbidden:
- one-click irreversible actions on primary screens

---

# 17. Component File Structure

Recommended pattern:

```txt
src/
  components/
    app/
      AppButton.tsx
      AppDialog.tsx
      AppTable.tsx
      AppEmptyState.tsx
      AppErrorState.tsx
    layout/
      AppShell.tsx
      Sidebar.tsx
      Topbar.tsx
    feedback/
      LoadingOverlay.tsx
      InlineError.tsx
      StatusBanner.tsx
      SyncFooter.tsx
    forms/
      fields/
        AppTextField.tsx
        AppNumberField.tsx
        AppSelectField.tsx
      patterns/
        FormSection.tsx
        FormActions.tsx
        ChildCollectionEditor.tsx
    feature/
      transactions/
      masterfiles/
      settings/
      reports/
```

---

# 18. Naming Standards

## Good
- `AppDialog`
- `ItemForm`
- `CartSidebar`
- `ManagerApprovalDialog`

## Bad
- `Dialog2`
- `FormFinalV3`
- `CashierWidgetTemp`
- `MasterfileThing`

Rules:
- name by purpose
- avoid vague names
- avoid UI-only names without behavior context

---

# 19. Anti-Patterns (Forbidden)

## Forbidden UI Patterns
- giant page files > 700 LOC without decomposition
- business logic inside JSX render trees
- duplicated save dialogs across modules
- inline toast strings everywhere
- multiple competing loading spinners
- direct IPC inside low-level presentational components
- route guards implemented inside random button handlers

---

# 20. Agent Implementation Contract

When generating or modifying UI, agents MUST:

1. identify component category first
2. reuse existing shared abstractions
3. keep business logic in hooks/services
4. keep visual logic in components
5. preserve role safety and route safety
6. implement loading / empty / error / success states
7. avoid creating one-off components without justification

---

# 21. Definition of Done

A UI component or page is considered complete only if:

- [ ] follows one approved component pattern
- [ ] supports loading/empty/error states
- [ ] supports keyboard interaction where relevant
- [ ] respects role/permission rules
- [ ] avoids direct DB/Electron access
- [ ] uses approved shared abstractions
- [ ] is testable and composable
- [ ] does not introduce inconsistent UX behavior

---