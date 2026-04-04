
# FEAT-MST-004 — Role-Based Access Control (RBAC) Master

## 1. Feature ID
FEAT-MST-004

## 2. Title
Role-Based Access Control (RBAC) Master

## 3. User Story
As an admin, I want to assign specific permissions to a role so that I can control user access across modules.

## 4. Objective
Manage roles, permissions, and branch access relationships for user authorization.

## 5. Scope

### Included
- Role CRUD
- RolePermission child mapping
- User role assignment
- BranchAccess child mapping

### Excluded
- Authentication login flow
- Runtime permission cache strategy

## 6. Inputs

```ts
type RoleSavePayload = {
  role: {
    id?: number;
    name: string;
    updatedAt?: string;
  };
  permissions: {
    accessRightId: string;
  }[];
};

type UserSavePayload = {
  user: {
    id?: number;
    username: string;
    roleId: number;
  };
  branchAccess: {
    branchId: number;
  }[];
  permissions: {
    action:string
  }[]
};
```

## 7. Business Rules
- Role must exist before assigning to user
- At least one BranchAccess row is required for a user
- Permissions are based on predefined Access Rights master/seed
- Users inherit permissions from assigned role
- Permission changes must take effect on next permission load / active session refresh policy

## 8. Technical Constraints
- Use enums or constants for AccessRightId
- No magic strings
- Save must use parent-child sync pattern

## 9. Error Cases
- Invalid role
- Empty branch access
- Unknown permission identifier

## 10. Acceptance Criteria
- Given a Role update, when permission is changed, then users with that role inherit updated access
- Given User creation, assigned Role must exist
- Given User creation, at least one BranchAccess row is required

## 11. Test Cases
- Save role with permissions
- Save user with branch access
- Reject invalid role
- Reject missing branch access

## 12. Agent Restrictions
- DO NOT hardcode permission strings inline
- DO NOT allow user creation without branch access