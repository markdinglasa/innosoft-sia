
# TECH SPEC — Permission-Aware Component Rendering

## 1. Spec ID
TECH-UTUI-003

## 2. Objective
Standardize how UI elements respond to permission state.

## 3. Problem Statement
Without a standard rendering policy, different screens may inconsistently hide, disable, or expose unauthorized actions.

## 4. Rendering Modes
```ts id="1r0d0q"
type GuardedRenderMode =
  | "HIDE"
  | "DISABLE"
  | "BLOCK_ON_CLICK"
  | "ESCALATE";
  ```

## 5. Guarded Action Contract
```ts
type GuardedActionConfig = {
  permission: string;
  mode: GuardedRenderMode;
  allowManagerOverride?: boolean;
};

```
## 6. Required Rules
- all guarded actions must declare permission requirement
- rendering behavior must be predictable
- sensitive actions should not rely on HIDE only
- action click path must still validate permission

## 7. Recommended Policy
- normal restricted action → HIDE or DISABLE
- sensitive operational action → ESCALATE or BLOCK_ON_CLICK

## 8. Acceptance Criteria
- guarded buttons render consistently
- unauthorized clicks are blocked
- escalation-enabled actions route into approval flow

## 9. Agent Restrictions
- DO NOT manually inline permission logic everywhere
- DO NOT let component rendering become the only enforcement layer