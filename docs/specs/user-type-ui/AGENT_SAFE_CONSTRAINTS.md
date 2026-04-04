# USER TYPE-BASED UI — AGENT SAFE CONSTRAINTS

## 1. Do Not Collapse UserType and Role
Agents must NEVER treat UserType and Role as interchangeable concepts.

Correct:
- UserType = static workspace identity
- Role = dynamic permission bundle

---

## 2. Do Not Implement One Giant Screen
Agents must NOT implement Admin, Cashier, and Teller as a single mega-component with excessive conditionals.

Bad:
```tsx id="0z4xvh"
if (userType === "Administrator") ...
else if (userType === "Cashier") ...
else if (userType === "Teller") ...
```
inside one 1500-line component.

Preferred:

separate shell components
shared child components where appropriate

## 3. Do Not Trust Renderer Alone

### Agents must NOT enforce permissions only in React components.

- All sensitive actions must also be validated through:
    - preload bridge
    - IPC validation
    - main process services

## 4. Do Not Hardcode Role Names in UI

### Agents must NOT rely on dynamic role labels like:

- "Manager"
- "Supervisor"
- "Admin"

for workspace selection.

Workspace selection must resolve from UserType only.

5. Do Not Use Magic Strings for Permissions

Agents must use centralized access-right constants/enums.

6. Do Not Grant Permission Through Mode Switching

Switching to Cashier Mode or Teller Mode must not automatically unlock actions.

7. Do Not Bypass Override Audit

Any sensitive action override must create an audit trail.

8. Do Not Leak State Across Workspaces

- Agents must isolate:
    - payment state
    - drawer state
    - report state
    - cart state
    - shell UI state

unless explicitly shared by design.

## 9. Do Not Implement Hidden-Only Security

- Hiding a button is not enough.
- Blocked actions must still fail safely if invoked indirectly.

## 10. Do Not Guess Missing Security Behavior

If an action is sensitive and override behavior is not specified:

- default to deny or block
- do not assume it is safe


```md

---

# 🔥 Recommended Code Architecture (Very Strongly Recommended)

Use this structure:

```txt id="dfrzmg"
/src/renderer/POS/features/workspaces
  /admin
    admin-workspace-shell.tsx
    admin-navigation.tsx
    admin-home-page.tsx

  /cashier
    cashier-workspace-shell.tsx
    cashier-navigation.tsx
    cashier-home-page.tsx

  /teller
    teller-workspace-shell.tsx
    teller-navigation.tsx
    teller-home-page.tsx

/src/renderer/POS/components/surfaces
    workspace-resolver.tsx
    workspace-guard.tsx
    permission-guard.tsx
    guarded-action-button.tsx
    forbidden-screen.tsx
    manager-override-modal.tsx
    workspace-route-registry.ts
```
And ideally:
```md
/src/features/auth
/src/features/rbac
/src/features/workspaces
/src/features/transactions
/src/features/settings
/src/features/reports
```