
---

# 15) `financial-reference-validation.spec.md`

```md
# TECH SPEC — Financial Reference Validation

## 1. Spec ID
TECH-MST-015

## 2. Related Feature
- FEAT-MST-011 — System Meta-Data & Config Master

## 3. Objective
Ensure all financial masterfile references are valid and correctly mapped before operational use.

## 4. Problem Statement
If financial masters are saved with broken references:
- taxes may post incorrectly
- payment reconciliation breaks
- accounting entries become inconsistent
- reporting becomes unreliable

## 5. Covered Entities
This validation applies to:
- Tax
- Payment Type
- Chart of Accounts (COA)
- possibly Discount / Terminal / other finance-linked masters if mapped later

## 6. Required Reference Rules

### Tax
A Tax record must reference a valid COA account.

Example:
```ts
type Tax = {
  id?: number;
  name: string;
  rate: number;
  accountId: number;
};
```

### Payment Type

A Payment Type must reference a valid GL / COA account.

Example:
```ts
type PayType = {
  id?: number;
  name: string;
  glAccountId: number;
};
```

## 7. Required Rules
- referenced account must exist
- referenced account must be active unless explicitly allowed
- tax rate must be valid according to business rule
- payment types without GL mapping are invalid if reconciliation depends on it
- account mappings must be validated before save

## 8. Recommended Optional Rules

- If your COA supports account typing:
  - Tax should map to valid tax/liability-type accounts
  - Cash/Card/GCash pay types should map to appropriate asset/clearing accounts

This is recommended but should only be enforced if your COA structure supports it.

## 9. Technical Constraints
- validation must occur in main process
- renderer must not be trusted for financial mapping integrity
- validation must be reusable by import flows too

## 10. Error Cases
```ts
type FinancialReferenceErrorCode =
  | "INVALID_ACCOUNT_REFERENCE"
  | "INACTIVE_ACCOUNT_REFERENCE"
  | "INVALID_TAX_RATE"
  | "PAYTYPE_GL_REQUIRED";

```

## 11. Acceptance Criteria
- tax save requires valid account mapping
- payment type save requires valid GL mapping
- invalid or inactive account references are rejected
- import path also respects same validation

## 12. Agent Restrictions
- DO NOT allow unmapped financial masters into production save flow
- DO NOT trust UI dropdowns as sufficient validation
- DO NOT bypass financial validation during imports