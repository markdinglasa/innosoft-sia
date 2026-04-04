
---

# `technical/auth-ipc-boundary.spec.md`

```md
# TECH SPEC — Authentication IPC Boundary

## 1. Spec ID
TECH-AUTH-009

## 2. Objective
Define secure renderer-to-main-process boundaries for authentication actions.

## 3. Problem Statement
Authentication is a critical trust boundary and must not be exposed directly to renderer implementation details.

## 4. Covered Actions
Examples:
- login
- logout
- lock session
- unlock session
- restore session
- get current session
- validate manager approval

## 5. Required Rules
- renderer must call preload-safe auth bridge only
- main process owns credential validation
- all auth requests must be schema-validated at IPC boundary

## 6. Recommended IPC Contract Style
```ts
type AuthBridge = {
  login(input: LoginRequest): Promise<LoginResult>;
  logout(): Promise<void>;
  getSession(): Promise<AuthenticatedSessionContext | null>;
  lockSession(): Promise<void>;
  unlockSession(input: UnlockRequest): Promise<UnlockResult>;
  approveSensitiveAction(input: ManagerApprovalRequest): Promise<ManagerApprovalResult>;
};
```
## 7. Acceptance Criteria
- renderer never directly touches DB or auth internals
- all auth operations pass through preload-safe boundary

## 8. Agent Restrictions
- DO NOT bypass preload bridge
- DO NOT call DB directly from React login forms