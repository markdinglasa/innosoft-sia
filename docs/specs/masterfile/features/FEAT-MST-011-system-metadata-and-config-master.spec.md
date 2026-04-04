# FEAT-MST-011 — System Meta-Data & Config Master

## 1. Feature ID
FEAT-MST-011

## 2. Title
System Meta-Data & Config Master

## 3. User Stories
### A. Financial Configurations (Tax & COA)
As an accountant, I want to define Tax rates and Chart of Accounts so that financial transactions are posted correctly.

### B. Operational Configurations (Terminal, Unit, Term, Period)
As a system admin, I want to manage technical masterfiles to support daily operations.

## 4. Objective
Provide all system-level and operational lookup entities required by transactions, settings, accounting, and reporting.

## 5. Scope

### Included
- Tax
- Chart of Accounts
- Payment Types
- Terminal
- Units of Measure
- Terms
- Accounting Periods

### Excluded
- Runtime settings persistence
- GL posting engine
- printer hardware driver implementation

## 6. Business Rules
- Tax must map to valid COA account code
- PayType must map to valid GL account
- Terminal must be bound to valid BranchId
- UOM must support conversion factor where applicable
- Closed accounting periods must block transaction saves in covered date range

## 7. Technical Constraints
- Closed period validation must be reusable by transaction module
- Masterfile save must not itself block historical viewing
- Reference integrity is mandatory

## 8. Error Cases
- Invalid account mapping
- Invalid branch reference
- Invalid UOM factor
- Overlapping or invalid accounting periods (recommended validation)

## 9. Acceptance Criteria
- Given Tax setup, valid COA mapping is required
- Given PayType creation, GL mapping is required
- Given Terminal save, BranchId is required
- Given UOM save, conversion factor is supported
- Given closed Period, transactions cannot be saved in that range

## 10. Test Cases
- Save tax with COA
- Reject invalid tax account
- Save payment type with GL
- Save terminal with branch
- Save UOM conversion
- Block transactions in closed period

## 11. Agent Restrictions
- DO NOT place transaction-period enforcement only in UI
- DO NOT save unmapped financial masters