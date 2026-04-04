# FEAT-MST-012 — Dining Space (Table) Management

## 1. Feature ID
FEAT-MST-012

## 2. Title
Dining Space (Table) Management

## 3. User Story
As an F&B manager, I want to group dining tables into sections so that I can manage floor assignments.

## 4. Objective
Manage physical dining layout structures for restaurant-style POS operations.

## 5. Scope

### Included
- Table Group CRUD
- Table assignment to group
- Table status display linkage

### Excluded
- Live dine-in order routing logic
- reservation engine

## 6. Inputs

```ts
type TableGroupSavePayload = {
  tableGroup: {
    id?: number;
    name: string;
  };
  tables: {
    tableId: number;
  }[];
};

```

## 7. Business Rules
- Table Group may contain multiple tables
- Assigned table references must exist
- POS view should be able to display Occupied/Vacant state of assigned tables
- Group save should use parent-child sync pattern

## 8. Technical Constraints
- Table occupancy state is read-only from transactional/dine-in state source
- Group definition does not own live occupancy state

## 9. Error Cases
- Invalid table reference
- Duplicate table assignment in same group

## 10. Acceptance Criteria
- Given a Table Group save, multiple Table IDs may be assigned
- Given POS view, assigned table statuses are displayable

## 11. Test Cases
- Save table group
- Assign multiple tables
- Reject invalid table ID
- Render table state source mapping

## 12. Agent Restrictions
- DO NOT store live occupied/vacant state as static masterfile data