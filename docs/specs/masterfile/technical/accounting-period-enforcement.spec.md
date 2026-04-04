
# TECH SPEC — Accounting Period Enforcement

## 1. Spec ID
TECH-MST-014

## 2. Related Features
- FEAT-MST-011 — System Meta-Data & Config Master
- Transaction Module integration


## 3. Objective
Prevent new transactions from being created inside closed accounting periods.

## 4. Problem Statement
If closed periods still allow posting:
- financial reports become unreliable
- reconciled books may be altered
- audit integrity is broken

## 5. Covered Entities
Applies to any transaction that posts accounting or operational records, including:
- Sales / Ordering
- Collection
- Disbursement
- Purchase Order (if financially posting or period-bound)
- Inventory Adjustment
- Inventory Transfer
- Journal Entry

## 6. Data Model
```ts
type AccountingPeriod = {
  id: number;
  branchId?: number | null;
  startDate: string;
  endDate: string;
  status: "OPEN" | "CLOSED";
};
```

## 7. Enforcement Rule

Before saving a transaction:

- determine transaction date
- determine branch context if applicable
- locate applicable accounting period
- if period status = CLOSED
    - reject save

## 8. Required Rules
- every saveable transaction must pass period check
- period validation must occur in main process/service layer
- UI may warn, but must not be sole enforcement
- historical viewing/reporting must remain allowed even for closed periods

## 9. Branch Scope Rule

- If periods are branch-specific:
    - only check periods for transaction branch

- If periods are global:
    - use system-wide applicable period

- This must be explicit in implementation.

## 10. Error Cases
```ts
type AccountingPeriodErrorCode =
  | "ACCOUNTING_PERIOD_NOT_FOUND"
  | "ACCOUNTING_PERIOD_CLOSED"
  | "INVALID_TRANSACTION_DATE";
```

## 11. Acceptance Criteria
- transactions inside closed period are rejected
- transactions inside open period are allowed
- closed period does not block report viewing
- period enforcement is not bypassable from renderer

## 12. Agent Restrictions
- DO NOT enforce closed-period rules only in UI
- DO NOT allow save retry to bypass period status
- DO NOT assume accounting period only matters for Journal Entry