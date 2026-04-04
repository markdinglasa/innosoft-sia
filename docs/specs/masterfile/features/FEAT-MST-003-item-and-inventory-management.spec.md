
# FEAT-MST-003 — Item & Inventory Management

## 1. Feature ID
FEAT-MST-003

## 2. Title
Item & Inventory Management

## 3. User Stories
### A. Create Item with Multiple Prices
As a user, I want to save an item with various price types so that I can support multiple selling strategies.

### B. Multi-Packaging Units (UOM Packages)
As a warehouse manager or cashier, I want to define multiple packaging units for an item so that I can buy and sell in different quantities with unique barcodes.

## 4. Objective
Manage products, price structures, inventory initialization, and packaging conversions.

## 5. Scope

### Included
- Item CRUD
- Multi-price child records
- Inventory initialization
- Packaging/UOM child records
- Barcode/SKU uniqueness
- Package-based quantity conversion

### Excluded
- Inventory movement transactions
- Purchase receiving logic

## 6. Inputs

```ts
type ItemSavePayload = {
  item: {
    id?: number;
    code?: string;
    sku: string;
    barcode?: string;
    name: string;
    unitId: number;
    isInventoryTracked: boolean;
    updatedAt?: string;
  };
  prices: {
    id?: number;
    priceType: "RETAIL" | "WHOLESALE" | "SPECIAL";
    amount: number;
  }[];
  packages?: {
    id?: number;
    relationUnitId: number;
    factor: number;
    sku?: string;
    barcode?: string;
    packagePrice: number;
  }[];
};
```

## 7. Outputs

```ts
type ItemSaveResult = {
  success: boolean;
  itemId: number;
};  
```

## 8. Business Rules
- SKU MUST be unique system-wide
- Barcode MUST be unique where applicable
- At least one price row is required
- Price amount must be > 0
- If IsInventoryTracked = true, initialize branch inventory record if missing
- Package factor MUST be > 0
- Package barcode/SKU must also be unique if provided
- Package scan behavior must multiply quantity using package factor

## 9. Technical Constraints
- Prices and packages are child collections under item save
- Inventory initialization must happen in same transaction if required
- Use enums for PriceType

## 10. Error Cases
- Duplicate SKU
- Duplicate barcode
- Missing price
- Invalid package factor
- Invalid unit reference

## 11. Acceptance Criteria
- Given a new Item, when saved, then SKU must be unique
- Given tracked inventory, when saved, then default inventory record initializes
- Given no price, when saved, then reject
- Given package definition, when saved, then relation unit and factor are required
- Given package barcode scan in transaction, quantity conversion must be correct
- Given package factor <= 0, reject save

## 12. Test Cases
- Save item with 1+ prices
- Save item with package units
- Reject duplicate SKU
- Reject empty price list
- Reject invalid package factor
- Auto-create inventory row

## 13. Open Question
- Multi-currency pricing at masterfile level is currently unresolved and must not be assumed by agents.

## 14. Agent Restrictions
- DO NOT infer pricing tiers outside enum definition
- DO NOT initialize inventory in renderer