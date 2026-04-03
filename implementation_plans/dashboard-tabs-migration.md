# Implementation Plan: Migrating Dashboard Tabs to MUI

## Overview
Refactor the current non-functional tab structure in the Admin Dashboard to use standard MUI `@mui/material/Tabs` and `Tab` components. This will ensure consistent styling and proper React state integration.

## Requirements
- Replace custom `TabsList` and `TabsTrigger` (likely placeholders or Radix-based) with MUI `Tabs` and `Tab`.
- Maintain existing state variables: `salesTimeRange` and `salesDataType`.
- Ensure the `onChange` handlers correctly update the state.
- Preserve the layout (flex container in the CardHeader).

## Architecture Changes
- Update imports in `src/renderer/src/POS/features/admin-dashboard/components/dashboard.tsx`.
- Modify the JSX structure within the `Sales Trends` card header.

## Implementation Steps

### Phase 1: Update Imports & Shared State Logic
1. **Update MUI Imports** (File: `src/renderer/src/POS/features/admin-dashboard/components/dashboard.tsx`)
   - Action: Add `Tab` to the named imports from `@mui/material`.
   - Why: Required for individual tab items in MUI.

2. **Add Missing Event Handler** (File: `src/renderer/src/POS/features/admin-dashboard/components/dashboard.tsx`)
   - Action: Implement `handleSalesDataTypeChange` to match MUI's signature `(_: React.SyntheticEvent, newValue: string) => void`.
   - Why: MUI Tabs use the second argument for the new value, consistent with `handleSalesTimeRangeChange`.

### Phase 2: Refactor JSX
3. **Migrate Time Range Tabs** (File: `src/renderer/src/POS/features/admin-dashboard/components/dashboard.tsx`)
   - Action: Replace the first `Tabs` block. Remove `TabsList` and use `<Tab label="Today" value="today" />` etc.
   - Why: Clean up to use standard MUI components.

4. **Migrate Data Type Tabs** (File: `src/renderer/src/POS/features/admin-dashboard/components/dashboard.tsx`)
   - Action: Replace the second `Tabs` block.
   - Why: Consistency across the dashboard.

## Testing Strategy
- Manual verification: Click through all tabs and ensure the `LineChart` title and state update correctly.
- Console check: Ensure no "Component not found" or "Unknown prop" warnings.

## Risks & Mitigations
- **Risk**: Visual regression (MUI Tabs have different default styling than Shadcn).
  - Mitigation: Use `size="small"` or `sx` props to ensure they fit within the card header.

## Success Criteria
- [ ] Users can toggle between Today/Week/Month.
- [ ] Users can toggle between Revenue/Transactions.
- [ ] Code follows standard MUI patterns.
