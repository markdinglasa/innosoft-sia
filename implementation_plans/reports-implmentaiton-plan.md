# 📊 REPORTS HUB — IMPLEMENTATION PLAN

This document defines the **reporting and analytics system contract**.
All agents MUST follow this specification.

---

# 🎯 OBJECTIVE

Provide fast, accurate, and offline-capable reporting for:
- Sales analytics
- Transaction summaries
- Inventory tracking
- Audit trails

---

# 🧩 MODULE STRUCTURE

/src/renderer/POS/features/reports
  /sales
  /collections
  /disbursements
  /inventory
  /audit

  /shared
    /services
    /hooks
    /store
    /types
    /formatters

/src/main/services/reports.services
/src/main/services/reports.controllers


---

# CORE PRINCIPLES (CRITICAL)

## 1. READ-ONLY SYSTEM
- Reports MUST NEVER modify data
- No side effects allowed

## 2. DETERMINISTIC OUTPUT
- Same input → same result
- No hidden calculations in UI

## 3. PERFORMANCE FIRST
- Avoid heavy real-time queries when possible
- Use aggregation strategies

## 4. OFFLINE-FIRST
- Reports must work without internet
- Use local DB only

---

# 📚 REPORT TYPES

## 1. SALES SUMMARY
- Total sales
- Gross / Net
- Discounts
- Taxes
- Per day / per branch

---

## 2. DAILY TRANSACTIONS
- List of transactions
- Filter by date, terminal, cashier

---

## 3. INVENTORY REPORT
- Stock on hand
- Movement history
- Low stock alerts

---

## 4. AUDIT LOGS
- User actions
- Login/logout
- Voids / overrides

---

# 🧱 DATA SOURCES

Reports MUST pull from:

- Ordering
- Collections
- Disbursements
- InventoryLedger
- Users
- Masterfiles

---

# 🔁 REPORT FLOW (STRICT)

Select Report (Renderer)
→ Send filters
→ IPC call
→ Main service fetch
→ Aggregate data
→ Return structured result
→ Render UI
→ Optional export

---

# ⚙️ FILTER SYSTEM

## Standard Filters

- Date range (REQUIRED)
- BranchId
- TerminalId
- UserId
- ItemId (for inventory/sales detail)

---

## RULES

- Date range MUST be validated
- Prevent unbounded queries

---

# 🧠 AGGREGATION ENGINE (CORE)

## RULE

All aggregation MUST happen in:
→ Main process OR DB (preferred)

NOT in renderer.

---

## Example: Sales Summary

```sql
SELECT 
  SUM(TotalAmount) AS TotalSales,
  SUM(DiscountAmount) AS TotalDiscount,
  SUM(TaxAmount) AS TotalTax
FROM Transactions
WHERE CreatedAt BETWEEN @start AND @end
AND Status = 'POSTED'
```

## REPORT SERVICE LAYER

Each report has its own service:

- orderReportService
- collectionReportService
- disbursementReportService
- inventoryReportService
- auditReportService 

## RULE
DO NOT create one giant report service
Keep reports isolated

## PERFORMANCE STRATEGY
MUST
- Use indexed columns (date, branchId)
- Avoid SELECT *
- Use aggregation queries
- Paginate large datasets
OPTIONAL (ADVANCED)
- Pre-aggregated tables (daily summaries)
- Materialized views


## INVENTORY REPORT LOGIC
Source: InventoryLedger

Compute:

- Opening balance
- Movements
- Closing balance

RULE
All critical actions MUST be logged:

- Login
- Logout
- Void transaction
- Settings changes

## EXPORT SYSTEM
Supported Formats
- PDF
- Excel (CSV/XLSX)
RULES
- Export MUST use the same dataset as UI
- No recomputation during export
- Format in renderer OR main (not both)

## EXPORT FLOW
Generate report
→ Format data
→ Generate file
→ Save locally
→ Return file path

## SECURITY RULES
- Enforce permission checks
- Restrict sensitive reports
- Validate all filters

## EDGE CASES (MUST HANDLE)
- Empty dataset
- Large dataset
- Invalid date range
- Missing filters
- Corrupt data

## TEST CASES (MANDATORY)
Unit Tests
Aggregation correctness
Filter validation
Export formatting
Integration Tests
Full report generation
Permission enforcement

## PERFORMANCE TARGETS
- Report load < 500ms (small data)
- Paginated load for large datasets
- Export < 2s for standard reports

## AGENT RESTRICTIONS
- DO NOT compute aggregates in UI
- DO NOT fetch entire tables without filters
- DO NOT bypass permission checks
- DO NOT mix report logic with UI

## FILE NAMING CONVENTION

- Reports: /src/renderer/POS/features/reports
- Services: /src/main/services/reports.services
- Controllers: /src/main/services/reports.controllers
- Types: /src/renderer/POS/features/reports/shared/types
- Hooks: /src/renderer/POS/features/reports/shared/hooks
- Store: /src/renderer/POS/features/reports/shared/store
- Formatters: /src/renderer/POS/features/reports/shared/formatters  

## FAILURE BEHAVIOR

If:

- Query fails → return safe error
- No data → return empty dataset (not error)
- Permission denied → block access

## IMPLEMENTATION STRATEGY

Agents MUST:

- Implement report services (main process)
- Implement aggregation queries
- Implement filter validation
- Implement IPC layer
- Implement renderer store + hooks
- Implement UI last

## PRINCIPLE

Reports must be:

- Accurate
- Fast
- Read-only
- Aggregated at source
- Secure