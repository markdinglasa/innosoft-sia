# SPEC_ROADMAP — Innosoft Specs Implementation

Turn the domain specifications in `/docs/specs` into a production-ready implementation following the established `feature-pattern` and Electron IPC boundaries.

## 0. Current State Analysis & Gap Map

This roadmap is based on an audit of `/docs/specs` vs `/src/renderer/src/POS/features` and `/src/main`.

### Domain Status Matrix

| Domain | Spec Features | Current Implementation | Status | Gaps Identified |
|--------|---------------|------------------------|--------|-----------------|
| **Authentication** | FEAT-AUTH-001 (Login) to 008 (Manager Approval) | `features/authentication` | Partial | Manager overrides (approveSensitiveAction), session locking |
| **Masterfile Hub** | FEAT-MST-001 to 012 | `features/mst-*` | Robust | Organizational entities (FEAT-MST-007), Bulk import/export engine |
| **Transaction** | FEAT-TRX-001 to 011 | `features/trn-*` | Active | Shift/Cashier binding (FEAT-TRX-011), Suspended sales recall |
| **Notification** | Real-time Sync, Email Queue | `features/sys-notification` | Partial | Real-time Socket Integration, Main-process email queue |
| **Reports** | (Empty README) | (No folder) | MISSING | Complete report engine (X-Reading, Z-Reading, Audit) |

---

## Phase 1: Core Hubs & Foundation (Masterfile Hub)
**Focus:** Finalize the "Source of Truth" for all transactional data.

### Step 1: Organizational & Personnel Sync (FEAT-MST-007)
Audit and complete `mst-user`, `mst-role`, and `mst-branch-access`.
- **Tasks:**
  - Map `docs/specs/masterfile/feature/FEAT-MST-007` to existing components.
  - Implement missing Personnel entity fields.
  - Verify Role-Permission hydration at IPC boundary.
- **Acceptance:** All organizational entities visible and CRUD-capable in UI.

### Step 2: Bulk Data Engine & Validation (FEAT-MST-006)
Provide the standard import/export mechanism for Masterfiles.
- **Tasks:**
  - Build `generic-parent-child-crud-engine.spec.md` in Main.
  - Implement CSV/Excel parser following `bulk-import-upsert-engine.spec.md`.
  - Add optimistic locking following `optimistic-locking.spec.md`.
- **Acceptance:** Functional bulk upload for items/suppliers with validation.

---

## Phase 2: Transaction Engines & Validations
**Focus:** Atomic commits, real-time calculations, and cashier workflows.

### Step 3: Shift & Cashier Session Binding (FEAT-TRX-011)
Implement the terminal lifecycle and cashier accountability.
- **Tasks:**
  - Create `trn-shift` feature in renderer.
  - Implement Main process shift enforcement (no transaction without open shift).
  - Add IPC bridge for `lockSession` and `unlockSession`.
- **Acceptance:** Users must perform "Open Shift" before accessing the order screen.

### Step 4: Real-time Calculation & Tendering (FEAT-TRX-002, 003)
Strengthen the core POS calculation engine.
- **Tasks:**
  - Implement `TSS-TRX-001-calculation-engine.md` shared logic.
  - Finalize `trn-collection` for multi-tender payments following `FEAT-TRX-003`.
  - Add sensitive override authorization (FEAT-TRX-010) for discounts/voids.
- **Acceptance:** Orders correctly calculate taxes, discounts, and tender residuals.

---

## Phase 3: Reporting & Notifications
**Focus:** Auditability, end-of-day processes, and real-time alerts.

### Step 5: Master Reporting Hub
Build the reporting infrastructure from scratch (as identified in gaps).
- **Tasks:**
  - Create `reports` feature folder.
  - Implement X-Reading (current shift) and Z-Reading (daily close).
  - Build the PDF/Excel export pipeline following Main process service patterns.
- **Acceptance:** Cashiers can generate X-Reading; Managers can generate Z-Reading.

### Step 6: Real-time Notifications & Audit Trail
Implement background notifications and the critical audit trail.
- **Tasks:**
  - Complete `sys-notification` following `docs/specs/notification`.
  - Ensure all sensitive actions (Phase 2) trigger `sys-audit-trail` entries.
- **Acceptance:** Immediate notification on low stock or sensitive overrides.

---

## Invariants & Guardrails
- **Security:** Never bypass `ipcMain` for DB access.
- **State:** Use TanStack Query for Masterfiles and Zustand for active Transaction state.
- **Quality:** Every PR must include unit tests for the Main process service logic.
