# FEAT-MST-010 — Commercial Rules (Discounts)

## 1. Feature ID
FEAT-MST-010

## 2. Title
Commercial Rules (Discounts)

## 3. User Story
As a manager, I want to define discounts (Percentage, Fixed, BOGO) so that I can implement marketing promotions.

## 4. Objective
Manage reusable discount rules that can later be applied by transaction pricing engines.

## 5. Scope

### Included
- Discount CRUD
- Discount type rules
- Active date windows
- Always-active mode
- Stacking behavior rules

### Excluded
- Transaction-time discount execution logic
- Coupon redemption engine

## 6. Inputs

```ts
type DiscountSavePayload = {
  discount: {
    id?: number;
    name: string;
    type: "PERCENTAGE" | "FIXED" | "BOGO";
    value?: number;
    isAlwaysActive: boolean;
    startDate?: string;
    endDate?: string;
    stackingRule: "STACKABLE" | "HIGHEST_ONLY";
  };
};
```

## 7. Business Rules
- Percentage discount value must be between 0 and 100
- Fixed discount must be > 0
- BOGO may require separate rule config depending on implementation
- Discount must either:
  - have Start/End Date
  - OR be marked Always Active
- Stacking behavior must be explicitly defined

## 8. Technical Constraints
- Discount definition only; no transaction calculation in this module
- Use enums for type and stacking behavior

## 9. Error Cases
- Invalid percentage range
- Missing date window for non-always-active discount
- Invalid stacking rule

## 10. Acceptance Criteria
- Given Percentage discount, value must be 0–100
- Given Discount save, it must have date range or Always Active
- Given multiple discounts, stack rule is explicitly defined

## 11. Test Cases
- Save percentage discount
- Reject >100 percentage
- Save always-active discount
- Save fixed discount
- Save BOGO structure baseline

## 12. Agent Restrictions
- DO NOT implement discount execution here
- DO NOT assume BOGO shape without separate technical rule if needed