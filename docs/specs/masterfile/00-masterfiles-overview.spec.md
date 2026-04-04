# MASTERFILES HUB — OVERVIEW SPEC

## 1. Objective
Provide a centralized, structured, and reusable CRUD system for all masterfile entities in the POS system.

## 2. Scope
This module governs:
- Branches
- Items
- Item Prices
- Item Inventory
- Customers
- Suppliers
- Employees / Users
- Roles / Permissions
- Discounts
- Item Groups
- Item Components / BOM
- Item Packages
- Table Groups / Tables
- Taxes / Units / Payment Types / Accounts / Terminals / Periods / Terms

## 3. Architectural Rules
- Renderer MUST NOT access DB directly
- All CRUD operations MUST pass through:
  UI → Renderer Service → Preload IPC → Main Process Service → DB
- Parent-child saves MUST use DB transaction
- Soft delete is default behavior unless explicitly allowed
- All masterfile save payloads MUST be validated at IPC boundary

## 4. Cross-Cutting Constraints
- Use TypeScript strict typing
- Use Joi or Zod validation
- Use optimistic concurrency (`UpdatedAt`)
- Prevent circular references in hierarchical entities
- Child rows MUST remain synchronized with parent save requests

## 5. Performance Requirements
- Standard lookup < 200ms
- Cached list navigation < 100ms
- Large lists must use virtualization

## 6. Security Rules
- All save/delete operations must be permission-protected
- Sensitive entities (Role, Tax, Account, Terminal, Branch) require elevated permissions

## 7. Global Acceptance Criteria
- No direct DB calls from renderer
- No partial parent-child commits
- No hard delete unless explicitly allowed
- All entities support active/inactive lifecycle where applicable