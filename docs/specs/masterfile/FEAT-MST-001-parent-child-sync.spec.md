# FEAT-MST-001 — Parent-Child Sync Logic

## 1. Feature ID
FEAT-MST-001

## 2. Title
Parent-Child Sync Logic

## 3. User Story
As a system, I want to automatically add, update, or remove child records during a parent update so that the relational data remains consistent.

## 4. Objective
Create a standardized CRUD engine for saving parent entities with child collections in a single atomic operation.

## 5. Scope

### Included
- Insert new child records
- Update existing child records
- Remove missing child records from submitted payload
- Refresh parent `updateDateTime`
- Reject stale updates using optimistic locking

### Excluded
- UI rendering logic
- Child entities unrelated to parent payload

## 6. Primary Use Cases
- Item → ItemPrices
- Item → ItemInventory
- Role → RolePermissions
- User → BranchAccess
- Discount → DiscountItems
- TableGroup → Tables

## 7. Inputs

```ts
type ParentChildSavePayload<TParent, TChild> = {
  parent: TParent & {
    id?: number;
    updateDateTime?: string;
  };
  children: TChild[];
};
```


## 8. Outputs
```
type SaveResult = {
  success: boolean;
  parentId: number;
  updateDateTime: string;
};
```

## 9. Business Rules
- Parent and all child saves MUST execute inside one DB transaction
- Missing child rows from payload MUST be treated as delete/deactivate depending on entity rules
- Existing child rows MUST be matched by Id
- New child rows are identified by missing/empty Id
- Parent updateDateTime MUST refresh after successful child sync
- If submitted updateDateTime does not match DB updateDateTime, reject with DATA_OUTDATED

## 10. Technical Constraints
- Main process only
- No renderer-side merge logic
- Validation must happen before DB transaction starts
- Use optimistic concurrency

## 11. Error Cases
- Parent not found
- Child payload invalid
- Duplicate child identifiers
- Optimistic lock failure
- DB transaction failure

## 12. Acceptance Criteria
- Given an existing Item with 3 prices, when updated with 2 prices, then DB reflects exactly those 2 prices
- Given a child update, when saved, then parent updateDateTime refreshes
- Given any child sync failure, then the entire save rolls back
- Given stale updateDateTime, when saving, then return Data Outdated

## 13. Test Cases
- Add new child row
- Update existing child row
- Remove missing child row
- Fail on stale version
- Rollback on child save failure

## 14. Agent Restrictions
- DO NOT perform child sync in renderer
- DO NOT split parent and child save into separate commits
- DO NOT silently overwrite stale data