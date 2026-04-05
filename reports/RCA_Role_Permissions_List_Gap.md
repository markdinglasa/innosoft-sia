# 🧠 RCA (Root Cause Analysis): Role Permissions Missing in list

**Date**: 2026-04-05
**Module**: Role MasterfileHub / BaseService
**Severity**: Medium (Visual mismatch in hub)

## ❌ Description
The Role MasterfileHub list component (`role-list.tsx`) shows `0 Rights` for all roles, including the `Administrator` role which is seeded with full permissions.

## 🕵️ Investigation Results

1. **Service Layer Strategy**:
   - `RoleService` extends `ParentChildService`, which inherits `list()` from `BaseService`.
   - `BaseService.list()` is a generic paginated fetcher.

2. **TypeORM Fetch Analysis**:
   - In `src/main/services/base.service.ts`, the `list()` method creates `findOptions` but only populates `take`, `skip`, `where`, and `order`.
   - **Critical Gap**: It lacks a `relations` property. In TypeORM, relations are not fetched by default unless explicitly specified or marked as `eager: true` in the entity definition.

3. **Entity Analysis**:
   - `MstRoleEntity` defines `permissions` as a `@OneToMany` relation.
   - It is not marked as `eager: true`.

---

## 🛠️ Root Cause(s)
1. **Missing Relation Fetching in Generic List**: The `BaseService.list` method is too generic and does not allow child services to specify which relations (like `permissions`) should be eagerly loaded during listing.

---

## 🏗️ Implementation Plan (TDD Workflow)

### Phase 1: Infrastructure Enhancement (BaseService)
1. **Extend BaseService**:
   - Add a `protected get listRelations(): string[]` getter.
   - Update `list()` to pass these relations to the repository `find` call.

### Phase 2: RoleService Override
1. **Update RoleService**:
   - Override `listRelations` to return `['permissions']`.

### Phase 3: Verification
1. Verify that `role-list.tsx` now shows the correct count of permissions in the list.
