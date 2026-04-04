# TECH SPEC — Workspace Shell Resolution

## 1. Spec ID
TECH-UTUI-001

## 2. Objective
Resolve the correct UI workspace shell based on static UserType.

## 3. Problem Statement
If workspace selection depends on dynamic role names or ad hoc logic, the app becomes inconsistent and insecure.

## 4. Resolution Rule
Workspace shell MUST resolve from `UserType`, not Role.

## 5. Supported UserTypes
```ts id="w6b6gz"
enum UserType {
  ADMINISTRATOR = "Administrator",
  CASHIER = "Cashier",
  TELLER = "Teller"
}
```
## 6. Shell Mapping
```ts
type WorkspaceShellKey =
  | "admin-shell"
  | "cashier-shell"
  | "teller-shell";

function resolveWorkspaceShell(userType: UserType): WorkspaceShellKey
```
## 7. Required Rules
- shell resolution must be deterministic
- unsupported UserType must fail safely
- role name must not be used as workspace resolver
- mode switching must be explicit and separate from default resolution

## 8. Error Cases
```ts
type WorkspaceResolutionErrorCode =
  | "INVALID_USER_TYPE"
  | "WORKSPACE_SHELL_NOT_MAPPED";
```

## 9. Acceptance Criteria
- Administrator resolves to admin shell
- Cashier resolves to cashier shell
- Teller resolves to teller shell
- invalid user type fails safely

## 10. Agent Restrictions
- DO NOT infer workspace from Role labels
- DO NOT hardcode fallback to Admin shell