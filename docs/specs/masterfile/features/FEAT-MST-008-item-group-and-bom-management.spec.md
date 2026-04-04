# FEAT-MST-008 — Item Group (Catalog) & BOM Management

## 1. Feature ID
FEAT-MST-008

## 2. Title
Item Group (Catalog) Management + Item Component (BOM)

## 3. User Stories
### A. Hierarchical Item-Group Management
As a user, I want to group items into categories and sub-groups so that I can organize the POS menu and generate grouped sales reports.

### B. Item Component (BOM) Management
As a kitchen manager or production supervisor, I want to define components/ingredients for an item so that the system can automatically track raw material consumption.

## 4. Objective
Support hierarchical item organization and bill-of-materials/component composition.

## 5. Scope

### Included
- ItemGroup CRUD
- Parent-child group relationships
- Group-to-item mappings
- Item BOM/component definitions
- Circular dependency protection

### Excluded
- Inventory deduction transaction execution
- Production order workflows

## 6. Inputs

```ts
type ItemGroupSavePayload = {
  group: {
    id?: number;
    name: string;
    parentGroupId?: number | null;
    updatedAt?: string;
  };
};

type ItemComponentPayload = {
  itemId: number;
  components: {
    componentItemId: number;
    quantityToDeduct: number;
  }[];
};
```

## 7. Business Rules
- Item groups may have parent groups but MUST NOT form cycles
- Deactivating a group may optionally hide child items from quick-pick menus
- Composite/kit items may contain one or more component items
- QuantityToDeduct must be > 0
- Component graph MUST NOT contain recursive dependency loops
- Parent item cost may optionally derive from sum of components

## 8. Technical Constraints
- Recursive cycle detection required
- Component validation must ensure referenced items exist

## 9. Error Cases
- Circular group relation
- Circular BOM relation
- Invalid component item
- Invalid quantity

## 10. Acceptance Criteria
- Given Item Group creation with parent, system avoids circular references
- Given Group deactivation, child items may be hidden from quick-pick
- Given composite item, components can be assigned
- Given circular component dependency, save is blocked

## 11. Test Cases
- Save nested item group
- Reject circular group nesting
- Save BOM components
- Reject circular BOM
- Reject zero quantity component

## 12. Agent Restrictions
- DO NOT implement recursive structures without cycle validation
- DO NOT deduct stock inside masterfile save