
# TECH SPEC — Hierarchical Cycle Detection

## 1. Spec ID
TECH-MST-012

## 2. Related Features
- FEAT-MST-002 — Dependency-Aware Soft Delete
- FEAT-MST-008 — Item Group (Catalog) Management

## 3. Objective
Prevent circular references in hierarchical masterfile entities.

## 4. Problem Statement
Hierarchical entities such as groups/categories may reference parent nodes.

Without cycle detection, the system may allow:
- A → B → A
- A → B → C → A

This breaks:
- tree rendering
- grouped reports
- recursive lookups
- menu organization

## 5. Covered Entities
Applies to any entity with self-referencing parent relation, including:
- ItemGroup
- future Category-like masters

## 6. Validation Rule
When saving a node with `parentId`:

The system MUST verify that:
- the chosen parent is not the same node
- the chosen parent is not any descendant of the current node

## 7. Detection Algorithm
Recommended approach:
- recursively walk upward from proposed parent
- if current entity ID is encountered → cycle detected

### Conceptual Logic
```ts
function wouldCreateCycle(nodeId: number, proposedParentId: number): boolean
```

## 8. Required Rules
self-parent assignment is invalid
indirect cycles are invalid
null/empty parent is valid for root node
cycle check must happen before commit

## 9. Technical Constraints
cycle detection must run in main process/service layer
renderer may pre-check, but must not be sole validator

## 10. Error Cases
```ts
type HierarchyCycleErrorCode =
  | "SELF_PARENT_NOT_ALLOWED"
  | "HIERARCHY_CYCLE_DETECTED"
  | "INVALID_PARENT_REFERENCE";
```

## 11. Acceptance Criteria
- self-parent save is rejected
- indirect cycle is rejected
- valid parent-child save succeeds
- root-level save succeeds

## 12. Agent Restrictions
- DO NOT trust tree structure from UI only
- DO NOT save hierarchical relations without cycle validation