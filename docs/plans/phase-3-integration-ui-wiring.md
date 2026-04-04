# Implementation Plan: Phase 3 - Integration & UI Wiring

## Overview
Wire the backend Masterfile and Transaction engines to the Renderer UI. This phase leverages the unified hooks and IPC bridges built in previous phases to create a reactive, performant user experience for the Masterfile Hub and Transaction modules.

## Requirements
- **Optimized Data Hub (FEAT-MST-005)**: Standardized data fetching with caching and virtualization support.
- **UI/UX Consistency**: Implement the Masterfile Hub screens (Branch, User, Role, Item, Partner) following the design specifications.
- **Transaction Wiring**: Implement Shift Control UI and Order Entry basics.

## Architecture Changes
- **New Feature/State**: Create `src/renderer/src/POS/features/masterfile-hub/store` (Zustand) for UI-state like `selectedBranchId`.
- **New Components**: Implement standardized `MasterfileList` and `MasterfileForm` base components to reduce duplication.

## Implementation Steps

### Phase 3.1: Renderer Data Hub & Base Components (Step 5)
1. **Extend `useMasterfile` Hook** (File: `src/renderer/src/POS/hooks/use-masterfile.ts`)
   - Action: Add support for "Lookup" queries (smaller, cached lists for dropdowns).
2. **Create Selection Store** (File: `src/renderer/src/POS/features/masterfile-hub/store/use-masterfile-store.ts`)
   - Action: Store currently selected entity for editing and active tab state.
3. **Build Generic Masterfile Layout** (File: `src/renderer/src/POS/features/masterfile-hub/components/hub-layout.tsx`)
   - Action: A two-pane layout: List on the left, Form on the right.

### Phase 3.2: Personnel & Org Hub Implementation (Step 6a)
4. **Implement Branch Module**:
   - Create `BranchList` and `BranchForm` using `useMasterfile('branch')`.
5. **Implement User Module**:
   - Create `UserForm` with Branch Access management (Parent-Child).
6. **Implement Role Module**:
   - Create `RoleForm` with Permissions matrix (Parent-Child).

### Phase 3.3: Catalog & Partner Hub (Step 6b)
7. **Implement Item Module**:
   - Create complex `ItemForm` with nested tabs for Prices, Packages, and BOM.
8. **Implement Customer/Supplier Modules**:
   - Standard CRUD wiring.

## Testing Strategy
- **Unit Tests**:
  - Test the `useMasterfile` hook cache invalidation after save.
  - Test Parent-Child form state reconciliation in the Renderer.
- **E2E Tests**:
  - Full flow: Create Branch -> Create User -> Bind User to Branch.

## Risks & Mitigations
- **Risk**: Large masterfile lists (Items) might lag the UI.
  - Mitigation: Use `react-window` or `virtuoso` for list virtualization as specified in FEAT-MST-005.
- **Risk**: Form state complexity with nested children.
  - Mitigation: Use `react-hook-form` with `useFieldArray` for robust array management.

## Success Criteria
- [ ] Users can browse, filter, and edit all 5 core organizational masterfiles.
- [ ] List switches are near-instant (<100ms) due to caching.
- [ ] Field validation is enforced on the frontend before IPC calls.
