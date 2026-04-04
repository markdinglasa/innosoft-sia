# TECH SPEC — Role Permission Resolution

## 1. Spec ID
TECH-MST-008

## 2. Related Feature
- FEAT-MST-004 — Role-Based Access Control (RBAC) Master

## 3. Objective
Define how role permissions are stored, resolved, and exposed for authorization checks.

## 4. Problem Statement
If permission handling is inconsistent, the system may:
- grant access incorrectly
- deny valid access
- expose protected features
- create "permission drift" between Role and User

## 5. Architecture Rule
Permissions are **role-driven** by default.

Users inherit permissions from:
- assigned Role
- associated RolePermission mappings

Branch access is handled separately and must not be mixed into permission resolution.

## 6. Permission Model

### Access Right Identity
Permissions MUST be based on a predefined access-right registry.

Example:
```ts
enum AccessRightId {
  MASTERFILES_ITEM = "masterfiles.item",
  MASTERFILES_CUSTOMER = "masterfiles.customer",
  TRANSACTION_SALES = "transaction.sales",
  REPORTS_SALES = "reports.sales",
  SETTINGS_TERMINAL = "settings.terminal"
}

```

### Permission Shape
```ts
type RolePermission = {
  roleId: number;
  accessRightId: AccessRightId;
};
```

### 7. Resolution Rules

When resolving permissions for a user:

fetch User
fetch assigned Role
fetch RolePermission rows
normalize into permission map
### Output Shape

```ts
type ResolvedPermissionMap = Record<
  AccessRightId,
  {
    action: string;
  }
>;
```

### 8. Required Rules

- Role must exist before permissions can resolve
- Unknown AccessRightId must be rejected
- Missing permission rows should default to deny
- Permission resolution must be deterministic
- Permission registry must be centralized (seed/static source)

### 9. Authorization Rule

UI and services should use:

```ts
canAccess("action-here")
```

### 10. Technical Constraints

- No magic strings inline
- No renderer-only source of truth
- Permission map may be cached per session, but source of truth is DB + access registry

### 11. Error Cases

```ts
type PermissionResolutionError =
  | "ROLE_NOT_FOUND"
  | "PERMISSION_NOT_FOUND"
  | "INVALID_PERMISSION_ACTION"
  | "PERMISSION_DENIED";
```

### 12. Acceptance Criteria

- valid role permissions resolve consistently
- unknown permission identifiers are rejected
- missing permissions default to deny
- users inherit permissions from assigned role

### 13. Agent Restrictions

- DO NOT hardcode permission checks in random components
- DO NOT treat missing permission row as allowed
- DO NOT merge branch access into permission matrix