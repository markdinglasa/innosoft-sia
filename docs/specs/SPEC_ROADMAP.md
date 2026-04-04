# SPEC_ROADMAP — Innosoft Specs Implementation

Turn the domain specifications in `/docs/specs` into a production-ready implementation following the established `feature-pattern` and Electron IPC boundaries.

## 0. Current State Analysis & Gap Map

This roadmap is based on an audit of `/docs/specs` vs `/src/renderer/src/POS/features` and `/src/main`.

### Domain Status Matrix

| Domain | Spec Features | Current Implementation | Status | Gaps Identified |
|--------|---------------|------------------------|--------|-----------------|
| **Authentication** | FEAT-AUTH-001 to 008 | `features/authentication` | Partial | Completed: Manager overrides, session locking. Pending: UI integration. |
| **Masterfile Hub** | FEAT-MST-001 to 012 | `features/mst-*` | **ACTIVE** | Core Organizational & Catalog Hubs (Users, Roles, Branches, Items) Completed. |
| **Transaction** | FEAT-TRX-001 to 011 | `features/trn-*` | **ACTIVE** | Shift/Cashier binding (FEAT-TRX-011) & Calc Engine (FEAT-TRX-002) Completed. |
| **Notification** | Real-time Sync | `features/sys-notification` | Partial | Real-time Socket Integration, Main-process email queue |
| **Reports** | (Empty README) | (No folder) | MISSING | Complete report engine (X-Reading, Z-Reading, Audit) |

---

### Phase High-Level Progress
- **Phase 1: Core Hubs** (Step 1 Personnel, Step 2 Bulk) - ✅ Step 1 COMPLETED
- **Phase 2: Transaction Engines & Validations** (Step 3 Shift, Step 4 Calcs) - ✅ COMPLETED
- **Phase 3: Integration & UI Wiring** (Step 5 Renderer Hooks, Step 6 Feature Modules) - ✅ COMPLETED
- **Phase 4: Reporting & Notifications** (Step 8 Master Reporting, Step 9 Alerts) - 🚀 IN PROGRESS (75%)

---

## Phase 1: Core Hubs & Foundation (Masterfile Hub)
**Focus:** Finalize the "Source of Truth" for all transactional data.

### Step 1: Organizational & Personnel Sync (FEAT-MST-007) - ✅ COMPLETED
- [x] Implement `ParentChildService` for multi-collection synchronization.
- [x] Wire `UserService`, `RoleService`, `BranchService`, `AccountService` to IPC.
- [x] Register Unified Masterfile IPC Registry.

### Step 2: Bulk Data Engine & Validation (FEAT-MST-006) - ⏳ PENDING
- [ ] Build `generic-parent-child-crud-engine.spec.md` in Main.
- [ ] Implement CSV/Excel parser following `bulk-import-upsert-engine.spec.md`.
- [ ] Add optimistic locking following `optimistic-locking.spec.md`.

---

## Phase 2: Transaction Engines & Validations - ✅ COMPLETED
**Focus:** Atomic commits, real-time calculations, and cashier workflows.

### Step 3: Shift & Cashier Session Binding (FEAT-TRX-011) - ✅ COMPLETED
- [x] Create `TrnShiftEntity` and `ShiftService` for session control.
- [x] Implement Main process shift enforcement guard in `OrderService`.
- [x] Create `useShift` hook and `ShiftModal` UI.

### Step 4: Real-time Calculation & Tendering (FEAT-TRX-002) - ✅ COMPLETED
- [x] Implement `calculation-engine.ts` shared logic (5-decimal precision).
- [x] Add inclusive/exclusive tax support and discount matrices.

---

### Phase 3: Integration & UI Wiring (Renderer Hubs) - ✅ COMPLETED
12. **Renderer Data Hub & Hooks**:
    - Standardized `useMasterfile` and `useShift` TanStack hooks. - ✅ COMPLETED
    - Feature-scoped Zustand stores for all modules. - ✅ COMPLETED
13. **Personnel, Catalog & Partner Hubs**:
    - **User Hub** (CRUD + Branch Access). - ✅ COMPLETED
    - **Branch Hub** (CRUD). - ✅ COMPLETED
    - **Role Hub** (CRUD + Permissions). - ✅ COMPLETED
    - **Item Hub** (CRUD + Prices + Packages + Tabs). - ✅ COMPLETED
    - **Customer Hub** (CRUD + AR Accounts). - ✅ COMPLETED
    - **Supplier Hub** (CRUD + AP Accounts). - ✅ COMPLETED
14. **Shift & Transaction Wiring**:
    - **ShiftModal** for session initialization. - ✅ COMPLETED
    - **Order Entry UI** with live Calc Engine. - ✅ COMPLETED

---

### Phase 4: Reporting & Notifications (Audit & Reconcile) - 🚀 IN PROGRESS
15. **X-Reading & Z-Reading Engine**:
    - Backend aggregation logic for shift breakdowns. - ✅ COMPLETED
    - IPC handlers for audit data fetch. - ✅ COMPLETED
16. **Reporting Hub UI**:
    - High-fidelity **ShiftReportView** for X-Reading. - ✅ COMPLETED
    - Tabbed layout for Audit History. - ✅ COMPLETED
17. **Real-time Notifications**:
    - Alert system for low stock and cash discrepancy. - 🚀 IN PROGRESS
    - Socket infrastructure & Local Main-to-Renderer broadcast. - ✅ COMPLETED
18. **Audit Trail Hub**:
    - Detailed record-level tracking for sensitive actions. - ✅ COMPLETED
    - Historical diff viewing and user action inspection. - ✅ COMPLETED

## Phase 4: Reporting & Notifications - ⏳ PENDING
**Focus:** Auditability, end-of-day processes, and real-time alerts.

### Step 8: Master Reporting Hub
- [ ] Create `reports` feature folder.
- [ ] Implement X-Reading (current shift) and Z-Reading (daily close).
- [ ] Build the PDF/Excel export pipeline.

### Step 9: Real-time Notifications & Audit Trail
- [ ] Complete `sys-notification` following `docs/specs/notification`.
- [ ] Ensure all sensitive actions trigger `sys-audit-trail` entries.

---

## Invariants & Guardrails
- **Security:** Renderer MUST NOT access Node APIs directly (use Preload).
- **State:** Use TanStack Query for Masterfiles and Zustand for UI/Transaction state.
- **Quality:** Maintain 80%+ test coverage for transactional logic.
