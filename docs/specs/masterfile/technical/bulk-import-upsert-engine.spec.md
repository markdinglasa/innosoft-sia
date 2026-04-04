
# TECH SPEC — Bulk Import Upsert Engine

## 1. Spec ID
TECH-MST-011

## 2. Related Feature
- FEAT-MST-006 — Bulk Import/Export Service

## 3. Objective
Define how imported masterfile rows create new records or update existing records safely.

## 4. Problem Statement
Imports must avoid:
- duplicate record creation
- partial broken updates
- identity collisions
- unpredictable merge behavior

## 5. Upsert Principle
For supported entities, import should use a stable identity key to determine whether a row should:

- INSERT as new
- UPDATE existing

## 6. Identity Keys
### Item
- primary import identity: `SKU`

Possible future identities (must be explicit if supported):
- Barcode
- External Code

## 7. Upsert Flow
For each validated row:

1. find existing record by identity key
2. if not found → insert
3. if found → update
4. synchronize child rows if entity requires it
5. collect result counters

## 8. Required Rules
- identity match must be deterministic
- import must not create duplicate identity values
- update path must still respect validation and optimistic safety where applicable
- import must not overwrite protected fields unless explicitly allowed

## 9. Import Behavior Modes
```ts
type ImportWriteMode =
  | "UPSERT"
  | "INSERT_ONLY"
  | "UPDATE_ONLY";
```

### Recommended default:
- UPSERT

### 10. Result Contract
```ts
type ImportWriteResult = {
  inserted: number;
  updated: number;
  failed: number;
  errors: {
    row: number;
    code: string;
    message: string;
  }[];
};
```
## 11. Transaction Strategy

### Recommended:
- row-level transactional safety inside batch execution
- OR configurable chunk transaction strategy

This prevents one bad row from always invalidating the entire file unless required.

## 12. Protected Field Rule

Examples of fields that should not be blindly overwritten unless explicitly allowed:

- system-generated IDs
- created timestamps
- immutable codes (if business rule says so)

## 13. Error Cases
```ts
type ImportUpsertErrorCode =
  | "IDENTITY_CONFLICT"
  | "UNSUPPORTED_UPSERT_KEY"
  | "PROTECTED_FIELD_OVERWRITE"
  | "DB_WRITE_FAILED";
```

## 14. Acceptance Criteria
- existing SKU updates instead of duplicating
- new SKU inserts successfully
- row-level failures are logged clearly
- upsert behavior is deterministic

## 15. Agent Restrictions
- DO NOT use “fuzzy matching” for identity resolution
- DO NOT merge by name when SKU is the canonical identity
- DO NOT overwrite protected system fields without explicit rule