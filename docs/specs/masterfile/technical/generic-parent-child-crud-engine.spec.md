# TECH SPEC — Generic Parent-Child CRUD Engine

## 1. Spec ID
TECH-MST-001

## 2. Related Feature
- FEAT-MST-001 — Parent-Child Sync Logic

## 3. Objective
Provide a reusable save engine for masterfile entities that contain parent-child relationships.

## 4. Problem Statement
Several masterfile entities require synchronized saving of:
- one parent row
- many child rows

Examples:
- Item → ItemPrices
- Item → ItemPackages
- User → BranchAccess
- Role → RolePermissions
- Discount → DiscountItems
- TableGroup → Tables

If implemented ad hoc per module, this creates:
- duplicate save logic
- inconsistent rollback behavior
- orphan child rows
- stale child state

## 5. Required Behavior
The engine MUST:
- save parent and children inside one DB transaction
- support insert / update / remove synchronization
- detect removed children from payload
- optionally soft-delete removed children if configured
- return a normalized save result
- refresh parent `UpdatedAt`

## 6. Save Pattern

### Input Pattern
```ts
type ParentChildSaveConfig<TParent, TChild> = {
  parentTable: string;
  childTable: string;
  parentPrimaryKey: string;
  childPrimaryKey: string;
  childForeignKey: string;
  softDeleteChildren?: boolean;
  validateParent: (input: TParent) => void;
  validateChild: (input: TChild) => void;
};

type ParentChildSavePayload<TParent, TChild> = {
  parent: TParent;
  children: TChild[];
};
```

## 7. Child Synchronization Rules

For each child row in payload:

### Insert

If child has no valid ID:

- insert as new row
- assign parent foreign key

### Update

If child ID exists in DB:

- update row fields
- ensure child belongs to same parent

### Remove

If existing DB child row is missing from payload:

- either:
    - hard delete (if allowed)
    - soft delete (IsActive = false)
- Default behavior should prefer soft delete where supported

## 8. Transaction Rules

All steps MUST occur in one DB transaction:

- validate payload
- validate optimistic lock
- save parent
- fetch existing children
- diff existing vs submitted children
- apply insert/update/remove operations
- update parent UpdatedAt
- commit

If any step fails:

- rollback entire transaction

## 9. Security Constraints

- renderer MUST NOT call DB directly
- engine MUST execute only in main process
- parent/child entity authorization must be validated before save

## 10. Error Codes

```ts
type ParentChildSaveResult = {
  success: boolean;
  parentId: number;
  updatedAt: string;
  insertedChildren: number;
  updatedChildren: number;
  removedChildren: number;
};
```

## 12. Acceptance Criteria

- Parent and child rows are always synchronized after save
- Missing child rows are correctly removed/deactivated
- Invalid child-parent linkage is rejected
- Any failure causes full rollback

## 13. Agent Restrictions

- DO NOT write one-off child sync logic if this engine already exists
- DO NOT split save into multiple DB commits
- DO NOT trust renderer child IDs without DB ownership validation