# TECH SPEC — Item Inventory Initialization

## 1. Spec ID
TECH-MST-005

## 2. Related Feature
- FEAT-MST-003 — Item & Inventory Management

## 3. Objective
Automatically initialize inventory records when an inventory-tracked item is created or enabled.

## 4. Problem Statement
Inventory-tracked items must have stock records available immediately for branch-based operations.

Without initialization:
- transactions may fail
- stock may appear missing
- item availability becomes inconsistent

## 5. Trigger Conditions
Inventory initialization must run when:

### On Create
- new Item saved with `isInventoryTracked = true`

### On Update
- existing Item changed from:
  - `false → true`

## 6. Inventory Record Rule
A default inventory record must be created for the applicable branch context.

## 7. Initial Values
```ts
type ItemInventoryInit = {
  itemId: number;
  branchId: number;
  quantityOnHand: 0;
  reservedQty: 0;
  reorderLevel?: number;
  isActive: true;
};
```

## 8. Required Rules
- only initialize if inventory record does not already exist
- inventory creation must occur inside same Item save transaction
- if initialization fails, Item save must rollback
- branch context must be explicit and valid

## 9. Open Design Rule

If your system supports multi-branch initialization strategy, choose one and document it explicitly:

### Option A

- Initialize only for current branch

### Option B

- Initialize for all active branches

Recommended default for now:

- Initialize for current branch only
- Extend later if needed

## 10. Error Cases
- invalid branch context
- duplicate invent  ory record
- failed inventory insert

## 11. Acceptance Criteria
- tracked Item creates inventory record if missing
- non-tracked Item does not create inventory
- enabling tracking later creates missing inventory
- inventory init failure rolls back Item save

## 12. Agent Restrictions
- DO NOT initialize inventory in renderer
- DO NOT create duplicate inventory rows
- DO NOT assume “all branches” unless explicitly implemented