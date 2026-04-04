
# FEAT-MST-002 — Dependency-Aware Soft Delete

## 1. Feature ID
FEAT-MST-002

## 2. Title
Dependency-Aware Soft Delete

## 3. User Story
As a system, I want to prevent the deletion of records referenced by other modules so that historical integrity is preserved.

## 4. Objective
Protect data integrity by replacing hard delete with dependency-aware soft delete behavior.

## 5. Scope

### Included
- Usage check before delete
- Soft delete (`IsActive = false`)
- Exclude inactive rows from standard lookups
- Circular dependency checks for hierarchical entities

### Excluded
- Physical hard delete
- Archive restore UI

## 6. Inputs

```ts
type DeletePayload = {
  entity: string;
  id: number;
};
```

## 7. Outputs
```
type DeleteResult = {
  success: boolean;
  mode: "SOFT_DELETE";
};
```

## 8. Business Rules
- Records referenced by active transactions or dependent masters MUST NOT be deletable
- Delete operation MUST default to IsActive = false
- Standard lookup APIs MUST exclude inactive records unless explicitly requested
- Hierarchical entities MUST be checked for circular dependencies before save

## 9. Technical Constraints
- Dependency checks must happen in main process
- Circular reference detection must be recursive
- Delete logic must be reusable across entities

## 10. Error Cases
- Record in use
- Record not found
- Circular dependency detected

## 11. Acceptance Criteria
- Given a Category with assigned Items, when delete is attempted, then block with Record in Use
- Given an unused record, when deleted, then set IsActive = false
- Given a soft-deleted record, when standard lookup runs, then it is excluded
- Given hierarchical save, when circular relation exists, then reject save

## 12. Test Cases
- Soft delete unused record
- Reject in-use record
- Hidden from default list
- Detect direct circular reference
- Detect deep circular reference

## 13. Agent Restrictions
- DO  NOT hard delete by default
- DO NOT allow hierarchical save without cycle validation