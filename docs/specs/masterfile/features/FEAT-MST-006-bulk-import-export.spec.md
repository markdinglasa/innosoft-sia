# FEAT-MST-006 — Bulk Import/Export Service

## 1. Feature ID
FEAT-MST-006

## 2. Title
Bulk Import/Export Service

## 3. User Story
As an admin, I want to upload a CSV file of products so that I can populate the system without manual entry.

## 4. Objective
Support high-volume data migration and maintenance using structured import/export templates.

## 5. Scope

### Included
- CSV/Excel import
- Row-level validation
- Upsert behavior
- Detailed error reporting
- Export template generation

### Excluded
- Direct DB insert bypassing validation
- Transaction module imports

## 6. Inputs

```ts
type ImportPayload = {
  entity: "ITEM";
  filePath: string;
};
```

## 7. Outputs

```ts
type ImportResult = {
  success: boolean;
  inserted: number;
  updated: number;
  failed: number;
  errors: {
    row: number;
    field?: string;
    message: string;
  }[];
};
```

## 8. Business Rules
- Every row must validate against masterfile schema before commit
- Existing SKU must perform upsert, not duplicate insert
- Partial row errors must be reportable in detail
- Import batch should use controlled transactional boundaries (configurable by implementation)

## 9. Technical Constraints
- File parsing in main process
- Validation must reuse same entity validators as manual entry
- Error logs must be deterministic and row-specific

## 10. Error Cases
- Invalid file format
- Missing required columns
- Duplicate malformed rows
- Schema mismatch

## 11. Acceptance Criteria
- Given CSV/Excel upload, rows are validated before commit
- Given existing SKU, row performs update
- Given invalid rows, detailed error log is returned

## 12. Test Cases
- Valid import
- Mixed valid/invalid rows
- Duplicate SKU upsert
- Missing column template
- Corrupt file upload

## 13. Agent Restrictions
- DO NOT bypass validation for imports
- DO NOT silently skip invalid rows without logging