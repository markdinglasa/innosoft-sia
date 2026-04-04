
# TECH SPEC — Item Package Barcode Resolution

## 1. Spec ID
TECH-MST-006

## 2. Related Feature
- FEAT-MST-003 — Item & Inventory Management

## 3. Objective
Allow Items to define package/barcode variants that resolve correctly during transactions and stock movement.

## 4. Problem Statement
An item may be sold or purchased in multiple units:

- 1 Pc
- 1 Box = 12 Pcs
- 1 Case = 24 Pcs

Each package may have:
- unique barcode
- unique SKU
- unique package price

The system must resolve package scans accurately.

## 5. Package Entity
```ts
type ItemPackage = {
  id?: number;
  itemId?: number;
  relationUnitId: number;
  factor: number;
  sku?: string | null;
  barcode?: string | null;
  packagePrice: number;
  isActive?: boolean;
};
```

## 6. Required Rules
- factor must be > 0
- relationUnitId must exist
- package barcode must be unique if provided
- package SKU must be unique if provided
- package belongs to exactly one parent Item

## 7. Resolution Behavior

When a transaction scans a barcode:

- If barcode matches Item barcode
    - resolve as base item quantity = 1
- If barcode matches ItemPackage barcode
    - resolve parent Item
    - resolved quantity = package factor
    - price source may use:
        - package price
        - or item pricing logic if configured later

## 8. Output Contract for Resolution
```ts
type BarcodeResolutionResult = {
  itemId: number;
  source: "ITEM" | "PACKAGE";
  resolvedQuantity: number;
  resolvedPrice?: number;
  packageId?: number;
};

```

## 9. Integrity Rules
- package factor must never be 0 or negative
- package cannot reference same item in invalid recursive way
- barcode lookup must be indexed for performance

## 10. Error Cases
- duplicate package barcode
- invalid factor
- invalid relation unit
- unresolved barcode

## 11. Acceptance Criteria
- package barcode resolves to correct parent item
- resolved quantity multiplies by factor
- invalid factor is rejected
duplicate barcode is rejected

## 12. Agent Restrictions
- DO NOT treat package barcode as separate unrelated item
- DO NOT calculate package quantity in UI only