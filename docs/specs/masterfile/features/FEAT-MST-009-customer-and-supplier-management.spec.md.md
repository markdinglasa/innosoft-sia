
# FEAT-MST-009 — Customer & Supplier Management

## 1. Feature ID
FEAT-MST-009

## 2. Title
Entity Relationship (CRM/SRM)

## 3. User Stories
### A. Customer Loyalty Profile
As a user, I want to maintain customer records so that I can apply loyalty discounts and track purchase history.

### B. Supplier Masterfile
As a purchasing officer, I want to manage supplier contacts and terms so that I can streamline procurement.

## 4. Objective
Manage customer and supplier entities with operational and financial defaults.

## 5. Scope

### Included
- Customer CRUD
- Supplier CRUD
- Duplicate detection
- Discount default mapping
- Payment terms linkage
- Purchase order relationship visibility

### Excluded
- Loyalty points transaction engine
- Supplier payment posting

## 6. Business Rules
- Customer may define default discount type
- Duplicate warning must trigger if email/phone already exists
- Supplier must include default payment term
- Supplier detail view should expose linked active purchase orders if available

## 7. Technical Constraints
- Duplicate detection should be warning-capable, not necessarily hard-block unless business policy says so
- Supplier term must reference valid Term master

## 8. Error Cases
- Invalid discount reference
- Invalid payment term
- Duplicate detection ambiguity

## 9. Acceptance Criteria
- Given Customer save, default Discount Type may be assigned
- Given Customer save with existing Email/Phone, flag potential duplicate
- Given Supplier save, Payment Terms are required
- Given Supplier view, active PO link should be available

## 10. Test Cases
- Save customer with discount
- Duplicate email detection
- Save supplier with payment term
- Reject invalid term reference

## 11. Agent Restrictions
- DO NOT silently merge duplicate customer records
- DO NOT hardcode payment terms