# TECH SPEC — Optimistic Locking

## 1. Spec ID
TECH-MST-002

## 2. Related Features
- FEAT-MST-001 — Parent-Child Sync Logic
- FEAT-MST-003 — Item & Inventory Management
- FEAT-MST-004 — RBAC Master
- FEAT-MST-007 — Organizational & Personnel Entities

## 3. Objective
Prevent silent overwrites when two users or processes update the same record concurrently.

## 4. Problem Statement
Without concurrency control:
- user A opens Item
- user B edits and saves Item
- user A saves old version
- user B’s changes get silently overwritten

This must never happen in critical masterfiles.

## 5. Required Mechanism
All mutable masterfile entities MUST support optimistic locking using:

- `UpdatedAt` timestamp
OR
- `RowVersion` field (if DB supports it)

Preferred current implementation:
- `UpdatedAt`

## 6. Save Rule
Every update request MUST include the last-known `UpdatedAt` from the client.

Before saving:
1. fetch current DB record
2. compare submitted `UpdatedAt` to DB `UpdatedAt`
3. if mismatch:
   - reject save
   - return `DATA_OUTDATED`

## 7. Comparison Rule
Comparison MUST be exact enough to prevent accidental overwrite.

### Example
```ts
if (payload.updatedAt !== dbRecord.updatedAt) {
  throw new AppError("DATA_OUTDATED");
}

```

## 8. Entity Coverage

Apply to:

- Item
- Branch
- Customer
- Supplier
- User
- Role
- Discount
- ItemGroup
- Tax
- Terminal
- Account
- Term
- Period
- TableGroup

## 9. UI Handling Requirements

When DATA_OUTDATED occurs:

- renderer MUST show conflict message
- renderer MUST NOT silently retry overwrite
- renderer MAY allow reload-and-review flow

## 10. Error Code

type OptimisticLockError = "DATA_OUTDATED";

## 11. Acceptance Criteria

- Stale save attempts are always rejected
- Current DB values are not overwritten by old payloads
- Save only succeeds if version matches

## 12. Agent Restrictions

- DO NOT ignore UpdatedAt on update requests
- DO NOT auto-overwrite stale records
- DO NOT only enforce concurrency in UI