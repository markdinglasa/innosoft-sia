# TECH SPEC — Workstation UI State Boundaries

## 1. Spec ID
TECH-UTUI-006

## 2. Objective
Define how workspace-specific UI state should be isolated and managed.

## 3. Problem Statement
If Admin, Cashier, and Teller UI state bleed into one another, the app becomes unstable and confusing.

## 4. Covered State
Examples:
- current workspace shell
- active navigation section
- open transaction/cart context
- active payment panel
- selected product category
- drawer tools state
- report filters

## 5. Required Rules
- workspace-specific state must be scoped
- switching workspaces must not leak irrelevant UI state
- shared state must be explicit and minimal
- transaction-critical state must be handled by transaction module, not random shell components

## 6. Recommended State Pattern
```ts id="o1jk4g"
type WorkspaceUiState = {
  currentWorkspace: "admin-shell" | "cashier-shell" | "teller-shell";
  activeSection?: string;
  transientUiFlags?: Record<string, boolean>;
};
```

## 7. Acceptance Criteria
- workspace state remains isolated
- switching workspaces does not carry irrelevant stale UI fragments
- critical transaction state is not lost due to shell rendering alone

## 8. Agent Restrictions
- DO NOT put all workspace state in one giant untyped global object
- DO NOT mix transaction engine state with shell-only UI state