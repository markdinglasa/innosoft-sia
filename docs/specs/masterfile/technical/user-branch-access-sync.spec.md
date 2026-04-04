
# TECH SPEC — User Branch Access Sync

## 1. Spec ID
TECH-MST-009

## 2. Related Features
- FEAT-MST-004 — RBAC Master
- FEAT-MST-007 — Organizational & Personnel Entities

## 3. Objective
Define how User → BranchAccess child records are validated and synchronized.

## 4. Problem Statement
A user may be authorized functionally by Role, but operationally must also be restricted to one or more branches.

Without strict branch access sync:
- users may transact in wrong branch
- reports may expose cross-branch data
- reassignment may leave stale branch access rows

## 5. Data Model
```ts
type BranchAccess = {
  id?: number;
  userId?: number;
  branchId: number;
  isDefault?: boolean;
  isActive?: boolean;
};
```

### 6. Required Rules

- every User must have at least one active BranchAccess
- all referenced branchId values must exist
- one default branch may be required depending on auth/session design
- duplicate branchId rows for same user are not allowed
- save must use parent-child sync engine

### 7. Save Behavior
#### Insert
- If branch row has no ID:
    - create new access row
#### Update
- If branch row exists:
    - update flags if applicable
#### Remove
- If DB row exists but is missing from payload:
    - deactivate or remove based on child sync strategy

### 8. Personnel Reassignment Rule

If Personnel branch assignment changes and system design says user branch follows personnel:
- corresponding User BranchAccess must be synchronized automatically
- This behavior must be explicit and not assumed globally unless enabled by design.

### 9. Session Enforcement Rule

At login / branch switch time:
- user may only select branches in BranchAccess set

### 10. Technical Constraints
- branch access checks must be enforced in main process or service layer
- renderer must not be sole enforcer of branch restrictions

### 11. Error Cases

```ts
type BranchAccessErrorCode =
  | "BRANCH_ACCESS_REQUIRED"
  | "INVALID_BRANCH_REFERENCE"
  | "DUPLICATE_BRANCH_ACCESS"
  | "DEFAULT_BRANCH_INVALID";
```

### 12. Acceptance Criteria
- user save requires at least one branch access
- invalid branch references are rejected
- duplicate branch access rows are rejected
- branch-restricted operations only allow assigned branches

### 13. Agent Restrictions
- DO NOT allow user creation without branch access
- DO NOT enforce branch access only in UI
- DO NOT assume personnel transfer must always auto-rewrite access unless designed