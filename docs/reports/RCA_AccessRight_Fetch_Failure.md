# 🧠 RCA (Root Cause Analysis): Access Rights Fetch Fail

**Date**: 2026-04-05
**Module**: Role MasterfileHub
**Severity**: High (Blocks permission assignment)

## ❌ Description
In `src/renderer/src/POS/features/mst-role/components/role-form.tsx`, the `useLookup('accessRight')` hook call returns an empty array, even though the database table for access rights is populated.

## 🕵️ Investigation Results

1. **Frontend Call Strategy**:
   - The component calls `useLookup('accessRight')` derived from `useMasterfile('role')`.
   - Due to the recent fix in `use-masterfile.ts`, this correctly attempts to fetch from the `accessRight` service via IPC.

2. **IPC Dispatch Analysis (`masterfileIpc.ts`)**:
   - The centralized `mstList` IPC handler uses a registry record named `services`.
   - **Critical Gap**: The `accessRight` key is completely missing from this record. As a result, the handler returns `Service 'accessRight' not found.` which leads to an empty response in the frontend.

3. **Backend Service Layer**:
   - `MstAccessRightEntity.ts` exists in the entity layer.
   - However, no corresponding `AccessRightService` exists in `src/main/services/masterfile.services/`.
   - The generic masterfile architecture requires an entity to have a service extending `BaseService` to be fetchable via generic List/Get handlers.

---

## 🛠️ Root Cause(s)
1. **Missing Service Implementation**: No CRUD-compatible service exists for the `AccessRight` entity.
2. **Missing IPC Registration**: The backend has not been configured to listen for the `accessRight` service identifier.

---

## 🏗️ Implementation Plan (TDD Workflow)

### Phase 1: Test Cases (Red)
1. Add an integration test in the main process to verify that calling `IpcChannel.mstList` with `serviceName: 'accessRight'` fails.
2. (Expected result: Failure with "Service not found")

### Phase 2: Backend Implementation (Green)
1. **Create Service**: Implement `AccessRightService` in `src/main/services/masterfile.services/access-right.service.ts`.
2. **Register Service**: Update `src/main/ipcMain/masterfileIpc.ts` to include `accessRight` in the `services` registry.
3. **Export Service**: Ensure it's exported in the masterfile service index.

### Phase 3: Verification (Pass)
1. Re-run IPC tests to verify `success: true`.
2. Check `role-form.tsx` UI to confirm dropdown population.
