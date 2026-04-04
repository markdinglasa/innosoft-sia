
---

# 5) `specs/ui-ux/ROUTING_AND_GUARDS.md`

```md
# Routing and Guards

## Purpose
This file defines how navigation, route access, workspace shells, and permission enforcement must work in the renderer.

This is a **security-sensitive UI area**.

---

# 1. Access Model

The application uses a **2-layer access model**:

## Layer 1 — Static UserType
Every user has exactly one base UserType:

- `Administrator`
- `Cashier`
- `Teller`

This determines:
- base workspace shell
- base navigation structure
- primary landing route
- default operational flow

---

## Layer 2 — Dynamic Role Permissions
Each user is assigned a Role with specific permissions.

Examples:
- `masterfiles.items.view`
- `reports.sales.view`
- `transaction.discount.apply`
- `transaction.void`
- `settings.terminals.edit`

This determines:
- visible buttons
- accessible feature routes
- action availability
- manager override requirements

---

# 2. Core Rule

## UserType defines the shell.
## Role permissions define access inside the shell.

Do NOT confuse them.

Bad model:
- “Admin role means Administrator UI”

Correct model:
- UserType = workspace identity
- Role = permission matrix

---

# 3. Recommended Route Zones

## 3.1 Public Routes
Accessible before authenticated session only.

Examples:
- `/login`
- `/activate-license`
- `/db-link`
- `/session-expired`

---

## 3.2 Authenticated App Routes
Accessible only after successful session restore.

Examples:
- `/app/*`

---

## 3.3 Workspace Route Zones

### Administrator
Examples:
- `/app/admin/dashboard`
- `/app/admin/masterfiles/*`
- `/app/admin/reports/*`
- `/app/admin/settings/*`
- `/app/admin/inventory/*`

### Cashier
Examples:
- `/app/cashier/pos`
- `/app/cashier/settlement`
- `/app/cashier/receipts`
- `/app/cashier/shift`

### Teller
Examples:
- `/app/teller/pos`
- `/app/teller/orders`
- `/app/teller/queue`

---

# 4. Route Guard Layers

Every protected route must pass ALL relevant checks:

## 4.1 Session Guard
Checks:
- authenticated session exists
- session not expired
- branch context exists
- terminal context exists if required

Fail action:
- redirect to `/login` or `/session-expired`

---

## 4.2 License / App Readiness Guard
Checks:
- license valid or grace rules active
- database linked
- required boot configuration complete

Fail action:
- redirect to readiness/setup route

Examples:
- `/activate-license`
- `/db-link`

---

## 4.3 UserType Guard
Checks:
- current route belongs to allowed shell family

Examples:
- Teller cannot enter `/app/admin/*`
- Cashier cannot open admin dashboard unless allowed through approved mode-switch flow

Fail action:
- redirect to their correct home route
- show forbidden feedback

---

## 4.4 Permission Guard
Checks:
- user role contains required permission(s)

Examples:
- `reports.sales.view`
- `masterfiles.items.edit`
- `transaction.refund`
- `settings.terminals.edit`

Fail action:
- block render or redirect
- show forbidden state

---

# 5. Recommended Guard Order

Recommended evaluation order:

1. App readiness guard
2. Session guard
3. UserType guard
4. Permission guard

Reason:
No point checking permissions if the app is not even licensed or the user is logged out.

---

# 6. Navigation Visibility Rules

## Menus must be permission-aware
A route link must only be shown if the user can use it.

But remember:

> Hidden navigation is not security.

Actual guards must still block access if someone:
- pastes a route
- manipulates history
- uses a devtools trick
- triggers a stale link

---

# 7. Sensitive Action Guarding

Some actions should not be permanently visible or enabled even if on the same page.

Examples:
- void
- price override
- manual discount
- z-read
- payout
- reprint official receipt

These actions require:
- explicit permission check
- possible manager override flow
- UI confirmation

Recommended UI wrapper:
- `PermissionButton`
- `GuardedAction`
- `ManagerApprovalAction`

---

# 8. Mode Switching Rules

## Administrator may optionally switch to Cashier Mode
Allowed only if designed explicitly.

Rules:
- must be deliberate
- must preserve audit identity
- must not mutate UserType
- must be represented as a temporary workspace mode

Example:
- UserType remains `Administrator`
- UI mode becomes `Cashier Mode`

This is not role reassignment.

---

# 9. Forbidden Patterns

Do NOT:
- hardcode permissions inside random components
- duplicate permission strings everywhere
- gate access only through menu visibility
- trust route params blindly
- let route components self-authorize inconsistently

---

# 10. Recommended Technical Pattern

## Hooks
- `useUserType()`
- `usePermissions()`
- `useCan(permission)`
- `useRouteGuard()`

## Components
- `ProtectedRoute`
- `UserTypeRoute`
- `PermissionRoute`
- `ForbiddenState`
- `PermissionButton`

---

# 11. UX Rules for Forbidden Access

When access is denied:

Use clear operator language:
- `You do not have access to this screen.`
- `Manager approval is required for this action.`

Avoid:
- blank screen
- app crash
- cryptic “403” without explanation

---

# 12. Golden Rule

A user must never be able to access a screen or action merely because:
- the button appeared
- the URL was typed
- a component forgot to hide itself