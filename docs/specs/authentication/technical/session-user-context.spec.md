
# TECH SPEC — Session User Context

## 1. Spec ID
TECH-AUTH-002

## 2. Objective
Define the canonical authenticated session object used across the application.

## 3. Problem Statement
Without a single canonical session context, different modules will infer user state inconsistently.

## 4. Session Context Contract
```ts
type AuthenticatedSessionContext = {
  sessionId: string;
  userId: string;
  username: string;
  displayName: string;
  userType: "Administrator" | "Cashier" | "Teller";
  roleIds: string[];
  permissions: string[];
  branchAccessIds: string[];
  activeBranchId?: string;
  activeTerminalId?: string;
  loginAtUtc: string;
  lastActivityAtUtc: string;
  isLocked: boolean;
};
```
## 5. Required Rules
- userType is mandatory
- permissions must be explicit, not inferred ad hoc
- activeBranchId may be pending only if branch selection policy allows it
- activeTerminalId may be pending only if terminal selection policy allows it

## 6. Acceptance Criteria
- all protected modules consume the same session context shape
- session context is sufficient to resolve workspace + authorization behavior

## 7. Agent Restrictions
- DO NOT let each module define its own session shape