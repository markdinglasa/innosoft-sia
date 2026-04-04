
# TECH SPEC — BOM Circular Dependency Detection

## 1. Spec ID
TECH-MST-013

## 2. Related Feature
- FEAT-MST-008 — Item Component (BOM) Management

## 3. Objective
Prevent circular dependencies in Item Component / BOM relationships.

## 4. Problem Statement
Composite or kit items may be built from other items.

Without dependency protection, the system may allow:
- Item A uses Item B
- Item B uses Item A

or deeper loops:
- A → B → C → A

This breaks:
- cost rollup
- stock deduction
- recursive BOM expansion
- production logic

## 5. Covered Structure
```ts
type ItemComponent = {
  parentItemId: number;
  componentItemId: number;
  quantityToDeduct: number;
};
```

## 6. Validation Rule

- When adding component items to a parent item:
    - The system MUST verify:
        - parent item is not its own component
        - no component path recursively leads back to parent

## 7. Detection Algorithm

### Recommended:
- graph traversal / DFS
- start from proposed component item
- walk its component tree
- if parent item encountered → reject

### Conceptual Logic
```ts
function wouldCreateBomCycle(parentItemId: number, componentItemId: number): boolean
```

## 8. Required Rules
- self-component is invalid
- indirect component cycles are invalid
- quantityToDeduct must be > 0
referenced component item must exist
duplicate same-component rows should be prevented or normalized explicitly

## 9. Technical Constraints
- BOM validation must happen before save
- recursive check must not depend on renderer-only state

## 10. Error Cases
```ts
type BomCycleErrorCode =
  | "SELF_COMPONENT_NOT_ALLOWED"
  | "BOM_CYCLE_DETECTED"
  | "INVALID_COMPONENT_ITEM"
  | "INVALID_COMPONENT_QUANTITY";
```

## 11. Acceptance Criteria
- self-component assignment is rejected
- indirect circular dependency is rejected
- valid BOM save succeeds
- zero/negative quantity is rejected

## 12. Agent Restrictions
- DO NOT allow BOM save without recursive validation
- DO NOT compute component recursion only in UI
- DO NOT allow component quantity <= 0