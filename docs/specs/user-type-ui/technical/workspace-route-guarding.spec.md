
# TECH SPEC — Workspace Route Guarding

## 1. Spec ID
TECH-UTUI-002

## 2. Objective
Define route access boundaries for each workspace shell.

## 3. Problem Statement
Users must not be able to access unauthorized screens through direct navigation or stale UI links.

## 4. Guarding Model
Every route should be evaluated against:
1. workspace compatibility (UserType)
2. required permission(s)
3. branch or context constraints if applicable

## 5. Route Contract
```ts id="2rkk4v"
type AppRouteMeta = {
  path: string;
  workspaceScopes: UserType[];
  requiredPermissions?: string[];
  allowManagerOverride?: boolean;
};
```

## 6. Required Rules
- unauthorized route access must redirect safely
- route guards must run before screen render where possible
- shared routes still require permission checks
- route metadata must be centralized

## 7. Redirect Policy

Recommended:

- redirect to workspace home
- show "Forbidden" notification or screen state

## 8. Error Cases
```ts
type RouteGuardErrorCode =
  | "WORKSPACE_FORBIDDEN"
  | "PERMISSION_FORBIDDEN"
  | "ROUTE_NOT_REGISTERED";
```

## 9. Acceptance Criteria
- wrong-workspace route is blocked
- missing permission route is blocked
- valid route access succeeds

## 10. Agent Restrictions
- DO NOT rely on menu hiding as route protection
- DO NOT scatter route rules across random components