# PHASE 1 — Core Hubs & Foundation Implementation Plan

This plan details the steps to implement and refine the Masterfile Hub following `FEAT-MST-007` and `FEAT-MST-006`.

## Goal
Finalize the "Source of Truth" for all organizational data, ensuring robust CRUD, bulk import, and cross-module synchronization.

---

## 1. Step 1: Organizational & Personnel Entities (FEAT-MST-007)
**Status:** Audit & Refine

### Tasks
- [ ] **Audit Existing Modules**: Check `src/renderer/src/POS/features/mst-user` and `mst-branch-access` for alignment with FEAT-MST-007.
- [ ] **Implement `mst-branch` Entity**: 
    - Create main process entity and service.
    - Add `BranchCode` uniqueness validation in `src/main/validators`.
- [ ] **Implement Personnel <-> User Linkage**:
    - Add personnel entity with optional `userId` field.
    - Implement transactional validation in `src/main/services/personnel.service.ts`.
- [ ] **Branch Deactivation Safety Check**:
    - Build `activeSessionService` in Main process.
    - Block `deactivateBranch` if active cashiers are detected.
- [ ] **Branch Reassignment Sync**:
    - Hook into personnel updates to automatically refresh `BranchAccess` table.

### Verification
- [ ] Create branch with duplicate code (expected: failure).
- [ ] Deactivate branch with active cashier (expected: block).
- [ ] Transfer personnel to another branch and verify access rights update.

---

## 2. Step 2: Bulk Data & Generic CRUD Engine (FEAT-MST-006)
**Status:** Implementation Required

### Tasks
- [ ] **Generic Main Process Engine**:
    - Create `generic-parent-child-crud-engine` in `src/main/services/core`.
    - Implement `optimistic-locking.spec.md` (version/timestamp checks).
- [ ] **Bulk Import Service**:
    - Integrate Excel/CSV parser (e.g., `xlsx`).
    - Build `bulk-import-row-validation` service using `yup` or `joi` schemas.
- [ ] **Renderer Integration**:
    - Add bulk upload modal to `mst-item` and `mst-supplier`.
    - Implement progress tracking for long-running imports.

### Verification
- [ ] Bulk upload 100+ items with mixed valid/invalid data (expected: partial success with detailed error report).
- [ ] Conflict test: Edit a row in UI while bulk update is running (expected: optimistic lock failure).

---

## 3. Step 3: UI-UX & Filter Standardization
**Status:** Maintenance & Consistency

### Tasks
- [ ] **Hook Convergence**: Update all `mst-*` modules to use URL-driven filtering as per `feature-pattern`.
- [ ] **Refine List Layouts**: Ensure `masterfilehub-layout.tsx` (if it exists) provides consistent navigation/search across all domains.

### Verification
- [ ] Filter by name, change page, then refresh (expected: filter state persists).

---

## Technical Guardrails
- **Main Ownership**: All business rules (BranchCode uniqueness, deactivation blocks) MUST be implemented in the Main process, not purely in React.
- **Rollback Strategy**: Use TypeORM transactions for all multi-table syncs (e.g., Personnel <-> User <-> BranchAccess).
