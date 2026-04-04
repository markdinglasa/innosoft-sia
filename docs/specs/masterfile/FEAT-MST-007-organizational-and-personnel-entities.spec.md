

# FEAT-MST-007 — Organizational & Personnel Entities

## 1. Feature ID
FEAT-MST-007

## 2. Title
Organizational & Personnel Entities

## 3. User Stories
### A. Multi-Branch CRUD
As an admin, I want to manage different physical branches so that I can segregate inventory and financial reports.

### B. Personnel/Employee Profile
As an admin, I want to manage employee records so that I can assign them to roles and track their performance.

## 4. Objective
Manage branches and personnel entities with proper operational linkage to users and access rights.

## 5. Scope

### Included
- Branch CRUD
- Personnel CRUD
- User-personnel linkage
- Branch reassignment synchronization

### Excluded
- Authentication flow
- Attendance/payroll systems

## 6. Business Rules
- BranchCode must be unique
- Active branch cannot be deactivated if active cashiers are currently logged in
- Personnel must link to a valid user account if system access is required
- Branch reassignment must synchronize BranchAccess where applicable

## 7. Technical Constraints
- Logged-in branch checks must be performed in main process
- Personnel/User linkage must be validated transactionally

## 8. Error Cases
- Duplicate BranchCode
- Deactivation blocked by active sessions
- Invalid user linkage

## 9. Acceptance Criteria
- Given Branch creation, BranchCode must be unique
- Given active branch deactivation, system checks for active cashiers
- Given Personnel creation, valid User Account link is required
- Given employee transfer, BranchAccess updates automatically

## 10. Test Cases
- Create branch
- Reject duplicate branch code
- Block deactivation with active sessions
- Link personnel to user
- Transfer branch access sync

## 11. Agent Restrictions
- DO NOT allow branch deactivation without active session check
- DO NOT assume every personnel row must automatically create a user unless explicitly designed