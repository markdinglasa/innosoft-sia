# TECH SPEC — Item Uniqueness Validation

## 1. Spec ID
TECH-MST-007

## 2. Related Feature
- FEAT-MST-003 — Item & Inventory Management

## 3. Objective
Ensure item identity fields remain globally unique and conflict-safe.

## 4. Problem Statement
Duplicate identity fields can break:
- barcode scanning
- SKU lookup
- inventory tracking
- import upsert behavior

## 5. Fields Covered
Uniqueness validation must apply to:

### Item Level
- SKU
- Barcode (if provided)

### Package Level
- Package SKU (if provided)
- Package Barcode (if provided)

## 6. Required Rules
- SKU must be unique system-wide
- Barcode must be unique system-wide
- package barcode must not conflict with:
  - item barcode
  - other package barcode
- package SKU must not conflict with:
  - item SKU
  - other package SKU

## 7. Update Rule
On update:
- current record must be excluded from self-conflict checks

## 8. Import Rule
During import:
- existing SKU should trigger upsert flow
- malformed duplicate collisions must be surfaced explicitly

## 9. Validation Timing
Validation must occur:
1. before DB write
2. inside transaction-safe flow
3. preferably backed by DB unique constraints where feasible

## 10. Error Codes
```ts
type ItemUniquenessErrorCode =
  | "DUPLICATE_SKU"
  | "DUPLICATE_BARCODE"
  | "DUPLICATE_PACKAGE_SKU"
  | "DUPLICATE_PACKAGE_BARCODE";
  ```