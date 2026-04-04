
# FEAT-MST-005 — Optimized Renderer Data Hub

## 1. Feature ID
FEAT-MST-005

## 2. Title
Optimized Renderer Data Hub

## 3. User Story
As a user, I want the masterfile lists to load instantly so that I can perform lookups without waiting for network/DB lag.

## 4. Objective
Create a cached, reactive, and performant renderer-side state hub for masterfile data.

## 5. Scope

### Included
- Renderer cache/store
- Lookup reuse
- Cache invalidation/update
- Virtualized list rendering

### Excluded
- DB access from renderer
- Business validation logic

## 6. Inputs

```ts
type ListQuery = {
  entity: string;
  filters?: Record<string, unknown>;
};
```

## 7. Outputs
```ts
type CachedListResult<T> = {
  rows: T[];
  source: "CACHE" | "REMOTE";
};
```
## 8. Business Rules
- If cached data is valid and not stale, renderer should use cache first
- Successful create/update/delete must invalidate or patch relevant cache entries
- Large datasets (1000+) must use virtualization
- Cache must not become source of truth over DB

## 9. Technical Constraints
- Use Zustand or Redux
- UI must not freeze on large lists
- Store must remain entity-scoped

## 10. Error Cases
- Stale cache after failed update
- Large dataset rendering lag
- Invalid local cache shape

## 11. Acceptance Criteria
- Given a module is opened, when cache is valid, data loads from store
- Given a successful update, store is updated or invalidated immediately
- Given 1000+ rows, UI remains smooth using virtualization

## 12. Test Cases
- Cache hit behavior
- Cache invalidation after save
- Virtualized rendering
- Store recovery after failed mutation

## 13. Agent Restrictions
- DO NOT duplicate API results into multiple unsynced stores
- DO NOT fetch full list repeatedly on every render