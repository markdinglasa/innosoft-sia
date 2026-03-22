# 📦 MASTERFILES HUB — IMPLEMENTATION PLAN

This document defines the **central master data system contract**.
All agents MUST follow this specification.

---

# 🎯 OBJECTIVE

Provide a centralized, consistent, and validated data layer for:
- All reference data (products, users, pricing, etc.)
- Cross-module dependencies (transactions, reports)
- Multi-branch configuration

---

# 🧩 MODULE STRUCTURE

/src/renderer/src/POS/features/masterfiles
  /branch
  /item
  /customer
  /supplier
  /user
  /role
  /discount
  /item-group
  /item-component
  /item-package
  /table
  etc...

/src/main/services/masterfiles.services
/src/main/controllers/masterfiles.controllers

---

# 🧱 CORE DESIGN PRINCIPLES (CRITICAL)

## 1. SINGLE SOURCE OF TRUTH
- Each entity has ONE owning service
- No duplicate logic across modules

## 2. RELATIONSHIP INTEGRITY
- Parent-child must be validated before insert/update
- No orphan records allowed

## 3. SOFT DELETE ONLY
- Use IsActive or IsDeleted flag
- NEVER hard delete critical records

## 4. BRANCH-AWARE DATA
- All records MUST include BranchId (if applicable)

---

# 🧩 ENTITY BREAKDOWN

## 🏢 BRANCH (MstBranch)
- Root entity for multi-branch system

---

## 📦 ITEM (MstItem)

### Fields
- Id
- SKU (UNIQUE)
- Barcode
- Name
- ItemGroupId
- UnitId
- IsInventoryTracked
- IsActive

---

### CHILDREN

#### 💰 MstItemPrice
- ItemId
- PriceType (Retail, Wholesale)
- Amount

#### 📊 MstItemInventory
- ItemId
- BranchId
- QuantityOnHand
- ReorderLevel

---

## 👤 CUSTOMER (MstCustomer)
- Id
- Name
- ContactInfo
- CreditLimit

---

## 🚚 SUPPLIER (MstSupplier)
- Id
- Name
- ContactInfo

---

## 👨‍💼 USER (MstUser)

### Fields
- Id
- Username
- RoleId

### CHILD

#### 🏢 MstBranchAccess
- UserId
- BranchId

---

## 🔐 ROLE (MstRole)

### CHILD

#### 🔑 MstPermission
- RoleId
- AccessRightId

---

## 🏷️ DISCOUNT (MstDiscount)

### CHILD

#### 🧾 MstDiscountItem
- DiscountId
- ItemId

---

## 🧱 ITEM GROUP (MstItemGroup)

### CHILD

#### MstItemGroupItem
- GroupId
- ItemId

---

## 🧩 ITEM COMPONENT (MstItemComponent)
- Used for recipes / bundles

---

## 📦 ITEM PACKAGE (MstItemPackage)
- Bundle pricing

---

## 🍽️ TABLE MANAGEMENT

### MstTableGroup
### MstTable

---

## ⚙️ SYSTEM SETTINGS (PER BRANCH)

- MstTax
- MstUnit
- MstPayType
- MstAccount
- MstTerminal
- MstPeriod
- MstTerm

---

# 🔁 DATA FLOW (STRICT)

UI → Module Service → Shared Service → IPC → Main Service → DB → Response → Store

---

# ⚙️ SERVICE LAYER RULES

## MUST
- Validate all inputs
- Enforce relationships
- Handle business rules

## MUST NOT
- Contain UI logic
- Access renderer state directly

---

# 🔐 VALIDATION RULES (CRITICAL)

## ITEM
- SKU must be unique
- Price must exist
- Unit must exist

## USER
- Role must exist
- Must have at least one BranchAccess

## DISCOUNT
- Must have at least one item

---

# 🔁 CRUD PATTERN (STANDARDIZED)

## CREATE

1. Validate input
2. Validate relationships
3. Insert parent
4. Insert children
5. Return full entity

---

## UPDATE

1. Validate input
2. Validate relationships
3. Update parent
4. Sync children (add/update/remove)
5. Return updated entity

---

## DELETE (SOFT)

1. Check dependencies
2. If used → prevent delete
3. Else → mark inactive

---

# 🔗 RELATIONSHIP RULES

- ItemPrice MUST NOT exist without Item
- Inventory MUST be per branch
- RolePermission MUST map to valid permissions
- BranchAccess MUST match existing branch

---

# ⚙️ IPC CONTRACT

## Renderer → Preload

---

# 🧠 CACHING STRATEGY

## In Renderer Store
- Cache master data per module
- Invalidate on update

## In Main Process
- Cache frequently used lookups (e.g. roles, units)

---

# ⚡ PERFORMANCE RULES

- Batch child inserts/updates
- Avoid N+1 queries
- Use indexed fields (SKU, Barcode)

---

# 🧪 EDGE CASES (MUST HANDLE)

- Duplicate SKU
- Missing relationships
- Deleting in-use records
- Partial updates
- Large datasets

---

# 🧪 TEST CASES (MANDATORY)

## Unit Tests
- Create item with children
- Update with child sync
- Prevent invalid relationships
- Soft delete behavior

## Integration Tests
- Full CRUD cycle
- Multi-branch data isolation

---

# 🚫 AGENT RESTRICTIONS

- DO NOT bypass service layer
- DO NOT write direct SQL in renderer
- DO NOT skip validation
- DO NOT hard delete records

---

# 🔁 FAILURE BEHAVIOR

If:
- Relationship invalid → reject
- Duplicate detected → reject
- Dependency exists → block delete

---

# 🧠 IMPLEMENTATION STRATEGY

Agents MUST:

1. Implement base CRUD service
2. Implement entity-specific validation
3. Implement child synchronization logic
4. Implement IPC handlers
5. Implement renderer store/hooks
6. Implement UI last

---

# 🧠 PRINCIPLE

Masterfiles must be:
- Consistent
- Validated
- Centralized
- Dependency-aware