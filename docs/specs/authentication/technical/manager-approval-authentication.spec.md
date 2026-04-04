# TECH SPEC — Manager Approval Authentication

## 1. Spec ID
TECH-AUTH-008

## 2. Objective
Define the secure secondary-auth flow for manager approval operations.

## 3. Flow
1. operator attempts restricted action
2. authorization fails
3. system checks if override is allowed
4. manager approval prompt opens
5. approver credentials / PIN are submitted
6. approver account is validated
7. approver permission is validated
8. approval is bound to the specific action only
9. audit log is written
10. action proceeds or fails

## 4. Required Rules
- approver must have required permission
- approval must be action-bound
- approval must be short-lived / one-time
- approval must not mutate operator base session

## 5. Recommended Approval Payload
```ts
type ManagerApprovalGrant = {
  approvedByUserId: string;
  approvedAtUtc: string;
  actionCode: string;
  scopeRef?: string;
};
```
## 6. Acceptance Criteria
- valid approval unlocks only the requested action
- invalid approval fails safely
- approval is auditable

## 7. Agent Restrictions
- DO NOT “temporarily grant all permissions” after approval