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