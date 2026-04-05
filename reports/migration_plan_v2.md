# Implementation Plan: Standardizing Remaining Masterfile Forms

## Overview
Migrate the remaining POS Masterfile forms (`UnitForm`, `UserForm`, `TermForm`) to the standardized Zod-based validation system and ensure all mandatory fields have the required UI indicators (red asterisk).

## Requirements
- Replace legacy `rules` validation with Zod schemas and `zodResolver`.
- Add `required` prop to all mandatory MUI input components.
- Standardize error handling and visual feedback using theme-consistent indicators.
- Use `z.infer` for form data types and remove manual interfaces.

## Architecture Changes
No architecture changes required. Following established patterns in the codebase.

## Implementation Steps

### Phase 1: Unit Form Migration
1. **Migrate UnitForm to Zod** (File: `src/renderer/src/POS/features/mst-unit/components/unit-form.tsx`)
   - Action: Implement `unitSchema`, update `useForm` to use `zodResolver(unitSchema)`, and add `required` prop to "Unit Name" TextField.
   - Why: Standardization and type safety.
   - Dependencies: None
   - Risk: Low

### Phase 2: User Form Migration
2. **Migrate UserForm to Zod** (File: `src/renderer/src/POS/features/mst-user/components/user-form.tsx`)
   - Action: Implement `userSchema`, update `useForm` to use `zodResolver(userSchema)`, and add `required` props to mandatory fields (Full Name, Username, etc.).
   - Why: Standardization and type safety.
   - Dependencies: None
   - Risk: Medium (complex form with field array)

### Phase 3: Term Form Migration
3. **Migrate TermForm to Zod** (File: `src/renderer/src/POS/features/mst-term/components/term-form.tsx`)
   - Action: Implement `termSchema`, update `useForm` to use `zodResolver(termSchema)`, and add `required` props to mandatory fields (Term Name, Number of Days).
   - Why: Standardization and type safety.
   - Dependencies: None
   - Risk: Low

## Testing Strategy
- Manual testing: Verify that validation errors appear correctly when fields are empty.
- Manual testing: Verify that the red asterisk is visible on all mandatory fields.
- TypeScript check: Run `npx tsc --noEmit` to ensure no type regressions.

## Risks & Mitigations
- **Risk**: Type mismatches during migration in UserForm due to nested objects (branchAccesses).
  - Mitigation: Use strict Zod schema matching the expected API payload.

## Success Criteria
- [ ] `UnitForm` uses Zod validation and shows red asterisks.
- [ ] `UserForm` uses Zod validation and shows red asterisks.
- [ ] `TermForm` uses Zod validation and shows red asterisks.
- [ ] Build passes with no TypeScript errors.
