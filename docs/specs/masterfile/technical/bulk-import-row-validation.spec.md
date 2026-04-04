
# TECH SPEC — Bulk Import Row Validation

## 1. Spec ID
TECH-MST-010

## 2. Related Feature
- FEAT-MST-006 — Bulk Import/Export Service

## 3. Objective
Define strict row-level validation rules for CSV/Excel imports before data reaches the database.

## 4. Problem Statement
Imports are dangerous because malformed files can:
- corrupt master data
- create duplicates
- bypass UI validation
- break downstream lookups

## 5. Validation Principle
Import validation MUST reuse the same business rules as manual form entry.

Imports must not have a “looser” validation path than UI saves.

## 6. Validation Pipeline
For each row:

1. parse raw file row
2. normalize headers/values
3. map into typed DTO
4. validate against entity schema
5. collect row-level errors
6. only pass valid rows to import engine

## 7. Supported Modes
```ts
type ImportValidationMode = "FAIL_FAST" | "COLLECT_ALL_ERRORS";

```
### Recommended default:
- COLLECT_ALL_ERRORS

## 8. Example Output
```ts
type ImportRowValidationError = {
  row: number;
  field?: string;
  code: string;
  message: string;
};
type ImportValidationResult<T> = {
  validRows: T[];
  invalidRows: ImportRowValidationError[];
};
```

## 9. Required Rules
- required fields must be present
- enum fields must match allowed values
- numeric fields must parse safely
- duplicate headers / missing headers must be detectable
- malformed rows must not reach DB write stage
- validation errors must be deterministic and row-specific

## 10. Item Import Example Rules

For Item import:

- SKU required
- Name required
- Unit required
- At least one price required
- price amount > 0
- package factor > 0 if package columns are provided

## 11. Technical Constraints
- parsing and validation should run in main process
- import validation should not mutate DB state
- line numbering must align with user file rows as clearly as possible

## 12. Error Codes
```ts
type ImportErrorCode =
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_ENUM_VALUE"
  | "INVALID_NUMBER_FORMAT"
  | "DUPLICATE_HEADER"
  | "MISSING_HEADER"
  | "INVALID_ROW_LENGTH"
  | "UNEXPECTED_ERROR";
```
## 13. Acceptance Criteria
- invalid rows are identified before DB write
- valid rows remain importable
- errors specify row and reason
- same business validation applies to import and manual entry

## 14. Agent Restrictions
- DO NOT bypass validation for imports
- DO NOT assume “close enough” values are acceptable
- DO NOT write validation logic only in UI
- DO NOT modify DB state during validation