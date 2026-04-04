
---

# `IMPLEMENTATION_RULES.md`

```md
# USER TYPE-BASED UI — IMPLEMENTATION RULES

## 1. Core Architecture Rule
UserType controls workspace shell.
Role controls permissions.

Never invert this.

---

## 2. Shell Separation Rule
Admin, Cashier, and Teller must be implemented as separate workspace shells.

Preferred structure:
```txt id="6d6gt3"
/src/renderer/POS/features/workspaces
  /admin
  /cashier
  /teller
```

- Avoid one giant POS page with excessive conditional rendering.

3. Shared Components Rule

Shared UI components are allowed, but must remain:

- composable
- role-safe
- permission-aware

### Examples:

- cart summary
- payment keypad
- report filters
- product tile
- guarded button

4. Permission-Aware Rendering Rule

4. Permission Enforcement Rule

All UI permissions must resolve from centralized permission state.

Never scatter hardcoded checks like:

if (user.role === "Manager") { ... }

Prefer:

canAccess("transaction.void", "canEdit")

## 5. Security Rule

UI hiding is not security.

Sensitive operations must still be enforced in:

- preload-safe IPC layer
- main process services
- transaction/business service layer

## 6. Route Rule

All routes must declare:

- workspace scope
- permission requirements
- optional escalation support

## 7. Override Rule

Manager override must be:

- explicit
- auditable
- action-bound
- temporary

Never use override as persistent elevation.

## 8. Mode Switching Rule

Mode switching changes shell only.
It does not grant permissions.

## 9. Renderer State Rule

Keep workspace UI state isolated from:

- auth state
- transaction engine state
- persistence engine state

## 10. Performance Rule

Workspace shell resolution and permission hydration must happen early so the app does not flicker between unauthorized screens.

## 11. UX Rule

Each workspace should optimize for its real-world operational purpose:

- Administrator → control and oversight
- Cashier → payment and settlement
- Teller → speed and order capture