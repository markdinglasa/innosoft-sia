
---

# 4) `item-price-sync.spec.md`

```md
# TECH SPEC — Item Price Sync

## 1. Spec ID
TECH-MST-004

## 2. Related Feature
- FEAT-MST-003 — Item & Inventory Management

## 3. Objective
Define the exact behavior for saving and synchronizing ItemPrice child records under an Item.

## 4. Problem Statement
Items may contain multiple pricing tiers:
- Retail
- Wholesale
- Special
- Future additional controlled types

Price rows must remain consistent with the parent Item and must not duplicate or drift.

## 5. Child Entity
```ts
type ItemPrice = {
  id?: number;
  itemId?: number;
  priceType: "RETAIL" | "WHOLESALE" | "SPECIAL";
  amount: number;
  isActive?: boolean;
};

```

## 6. Required Rules
- Every Item MUST have at least one active ItemPrice
- priceType must be from enum only
- amount must be > 0
- Duplicate priceType per Item is NOT allowed unless explicitly designed later
- Price rows are saved using parent-child sync engine

## 7. Sync Rules
### Insert
If price row has no ID:
- create new ItemPrice linked to parent Item

### Update
If ID exists:
- update amount / status
- verify row belongs to same Item

### Remove
If DB row exists but is missing from payload:
- deactivate or remove according to configured child behavior

## 8. Integrity Rules
- No two active price rows of same priceType for same Item
- ItemPrice rows cannot exist without parent Item
- ItemPrice save failure must rollback full Item save

## 9. Error Cases
```ts
type ItemPriceErrorCode =
  | "ITEM_PRICE_REQUIRED"
  | "INVALID_PRICE_TYPE"
  | "INVALID_PRICE_AMOUNT"
  | "DUPLICATE_PRICE_TYPE"
  | "ITEM_PRICE_PARENT_MISMATCH";
```

## 10. Acceptance Criteria
- Item save with valid price rows succeeds
- duplicate price type is rejected
- zero/negative amount is rejected
- removing a price updates DB state correctly
- child sync failure rolls back Item save

## 11. Agent Restrictions
- DO NOT store price type as uncontrolled free text
- DO NOT allow Item to save without at least one valid price