# TECH SPEC — Permission Hydration Pipeline

## 1. Spec ID
TECH-AUTH-004

## 2. Objective
Define how effective permissions are resolved and attached to the session.

## 3. Resolution Inputs
Permission hydration may include:
- role assignments
- branch-scoped permission filters if supported
- terminal restrictions if supported
- licensing feature gates if applicable

## 4. Resolution Output
```ts
type EffectivePermissionSet = string[];
```

## 5. Required Rules
- permissions must be explicit
- permission names should come from centralized constants or seeded access-right master
- duplicate permissions must be normalized
- missing permission resolution should default to deny

## 6. Recommended Function
```ts
function resolveEffectivePermissions(input: PermissionResolutionInput): EffectivePermissionSet
```

## 7. Acceptance Criteria
- same user context produces same permission set deterministically
- downstream modules can call canAccess(...) reliably

## 8. Agent Restrictions
- DO NOT infer permissions from role labels like "Manager"