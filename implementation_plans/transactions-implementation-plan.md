# 💳 TRANSACTIONS MODULE — IMPLEMENTATION PLAN

This document defines the **core transaction engine contract**.
All agents MUST follow this specification.

---

# 🎯 OBJECTIVE

Provide a fast, offline-capable, and reliable transaction system for:
- Ordering (POS)
- Collections
- Disbursements
- Purchase Orders
- Inventory Movements
- Journal Entries

---

# 🧩 MODULE STRUCTURE

/src/renderer/src/POS/features/transactions
  /pos                # Ordering & Sales (core)
  /collection
  /disbursement
  /purchase-order
  /inventory
  /journal

  /shared
    /engine           # pricing, tax, discount
    /store
    /types
    /services
    /validators

/src/main/services/transaction.services
/src/main/controllers/transaction.controllers

---

# CORE PRINCIPLES (CRITICAL)

## 1. ATOMICITY
- A transaction MUST either fully succeed or fail
- No partial saves

## 2. IMMUTABILITY
- Once saved, transactions MUST NOT be edited
- Use reversal/void instead

## 3. OFFLINE-FIRST
- System must function without internet
- Local DB is source of truth

## 4. NO DATA LOSS
- Every transaction must be persisted safely
- Use fail-safe mechanisms

---
# 🧠 TRANSACTION ENGINE (CORE LOGIC)

## Layers

1. Ordering Engine (UI layer)
2. Pricing Engine
3. Discount Engine
4. Tax Engine
5. Validation Engine
6. Commit Engine (DB)

---

# 🛒 POS FLOW (STRICT)

Scan Item
→ Add to Order (in-memory)
→ Recalculate totals
→ Apply discounts
→ Apply taxes
→ Checkout
→ Validate
→ Commit
→ Print

---

# ⚙️ ORDER ENGINE

## Rules

- Stored in memory (React state/store)
- No DB writes during order operations
- Must be fast (<50ms)

---

## PRICING ENGINE

Rules

- Resolve price from MstItem & MstItemPrice
- Support price tiers
- Must not mutate original item data

## DISCOUNT ENGINE

Rules

- Apply item-level first
- Then transaction-level
- Prevent negative totals

## TAX ENGINE

Rules

- Support inclusive/exclusive tax
- Use branch tax config
- Must be deterministic

## VALIDATION ENGINE

Rules

- Validate inventory availability
- Validate pricing
- Validate discounts
- Validate taxes
- Validate totals
- Must return detailed error messages

Before commit:

- Order not empty
- Payment >= total
- All items valid
- Inventory sufficient (if tracked)

## COMMIT ENGINE (CRITICAL)

Steps (ATOMIC)

- Begin DB transaction
- Insert Order
- Insert OrderLine
- Insert Collection
- Update InventoryLedger
- Commit DB transaction

If ANY step fails:

→ ROLLBACK everything

## INVENTORY LEDGER (CRITICAL)

- Must update inventory in real-time
- Must support multiple warehouses
- Must handle returns correctly
- Must be atomic with transaction commit

## OFFLINE SUPPORT (CRITICAL)

- All transactions MUST work without internet
- Local DB is source of truth
- Sync happens when connection restored
- No data loss during offline

## REVERSAL & VOID (STRICT)

- Transactions CANNOT be edited
- Use reversal for corrections
- Use void for cancellations
- Both MUST create new counter-transactions
- Both MUST update inventory correctly

## DATA MODEL (MSSQL)

### TrxOrder
- Id
- BranchId
- TerminalId
- CustomerId
- TotalAmount
- DiscountAmount
- TaxAmount
- NetAmount
- PaymentAmount
- ChangeAmount
- Status
- CreatedAt
- UpdatedAt

### TrxOrderLine
- Id
- OrderId
- ItemId
- Quantity
- UnitPrice
- DiscountAmount
- TaxAmount
- NetAmount

### TrxCollection
- Id
- OrderId
- PaymentMethodId
- Amount
- ChangeAmount
- ReferenceNumber

### InventoryLedger
- Id
- ItemId
- WarehouseId
- TransactionId
- QuantityChange
- Balance
- Type
- Reference

## RULES

- All transactions MUST have unique IDs
- All transactions MUST link to Branch
- All transactions MUST link to Terminal
- All transactions MUST link to User
- All transactions MUST have timestamp
- All transactions MUST have status

## PERFORMANCE REQUIREMENTS

- POS operations < 50ms
- Commit < 100ms
- Inventory update < 20ms
- No blocking operations
- Use async/await correctly

## EDGE CASES (MUST HANDLE)

- Network disconnected during commit
- Invalid item data
- Negative quantities
- Zero payments
- Concurrent access
- Corrupted data
- Large transactions

## TEST CASES (MANDATORY)

- Unit Tests
    - Pricing engine
    - Discount engine
    - Tax engine
    - Validation rules
    - Commit atomicity
    - Inventory updates
    - Reversal logic
- Integration Tests
    - Full POS flow
    - Offline → online sync
    - Concurrent transactions
    - Large orders

## AGENT RESTRICTIONS

- DO NOT modify committed transactions
- DO NOT bypass validation
- DO NOT write directly to DB from renderer
- DO NOT duplicate config logic
- DO NOT use synchronous file I/O
- DO NOT hardcode IDs or prices

## FAILURE BEHAVIOR

If commit fails:

→ Rollback transaction
→ Return detailed error
→ Keep order in memory
→ Retry option available

If inventory update fails:

→ Mark transaction as pending
→ Retry when online
→ Alert user if persistent failure

## IMPLEMENTATION STRATEGY

Agents MUST:

- Implement pricing engine
- Implement discount engine
- Implement tax engine
- Implement validation layer
- Implement commit engine
- Implement inventory ledger updates
- Implement offline storage
- Implement sync logic
- Implement reversal/void
- Implement UI last

## PRINCIPLE

Transactions must be:

- Atomic
- Immutable
- Offline-capable
- Fast
- Reliable
- Traceable

## ORDER OF IMPLEMENTATION (STRICT)

1. Pricing Engine
2. Discount Engine
3. Tax Engine
4. Validation Engine
5. Commit Engine
6. Inventory Ledger
7. POS UI
8. Offline Support
9. Reversal & Void
10. Sync Logic

## SUCCESS CRITERIA

- All transactions commit successfully
- Inventory updates correctly
- Offline mode works
- Reversals create counter-transactions
- No data loss occurs
- Performance targets met
- All tests pass    

## PERFORMANCE STRATEGY

MUST

- Use in-memory order
- Batch inserts
- Use DB transactions
- Avoid per-item DB calls
TARGET
- Add to order < 50ms
- Checkout commit < 300ms

## CONCURRENCY RULES

- Prevent double submission
- Disable checkout button after click
- Use transaction locks in DB   

## INVENTORY HANDLING
SALE
- Deduct stock
ADJUSTMENT
- Add/remove based on count
TRANSFER
- Deduct source, add destination

## OTHER TRANSACTION TYPES
COLLECTION
- Record incoming payments
DISBURSEMENT
- Record expenses
PURCHASE ORDER
- Increase inventory
JOURNAL ENTRY
- Accounting entries only

## RECEIPT SYSTEM
After successful commit:

- Generate receipt data
- Send to printer service
- Save printable format 

## OFFLINE SAFETY
Strategy
- Always save locally first
- Queue for sync (optional)
FAIL-SAFE
If crash during checkout:
→ Recover from last saved state

## EDGE CASES (MUST HANDLE)
- Network loss (should not matter)
- Power interruption
- Duplicate submission
- Negative stock
- Rounding errors

## AGENT RESTRICTIONS
- DO NOT write directly to DB from renderer
- DO NOT skip validation
- DO NOT allow editing posted transactions
- DO NOT perform partial commits


## TEST CASES (MANDATORY)
- Unit Tests
    -   Pricing calculation
    - Discount logic
    - Tax computation
    - Validation rules
- Integration Tests
    - Full checkout flow
    - Inventory updates
    - Rollback behavior

## FAILURE BEHAVIOR

If:

Validation fails → STOP
Commit fails → ROLLBACK
Unexpected error → LOG + FAIL SAFE

## IMPLEMENTATION STRATEGY

Agents MUST:

- Build order engine (frontend)
- Build pricing/discount/tax engines
- Build validation layer
- Build commit engine (main process)
- Integrate IPC
- Add receipt system

## PRINCIPLE

Transactions must be:

- Fast
- Atomic
- Immutable
- Recoverable
- Deterministic