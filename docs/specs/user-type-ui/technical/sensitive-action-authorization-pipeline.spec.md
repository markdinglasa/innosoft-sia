
# TECH SPEC — Sensitive Action Authorization Pipeline

## 1. Spec ID
TECH-UTUI-004

## 2. Objective
Define secure approval flow for restricted but override-capable actions.

## 3. Covered Actions
Examples:
- void
- discount override
- manual price override
- payout
- z-read
- forced transaction override

## 4. Pipeline
When a restricted sensitive action is attempted:

1. user initiates action
2. permission check fails
3. action metadata is checked for override eligibility
4. manager override modal is launched
5. override credentials / PIN are validated
6. approval is logged
7. action executes under approved override context

## 5. Required Rules
- override approver must have valid permission
- approver must not be the same operator if policy forbids self-approval
- approval must be time-bound and action-bound
- approval must not mutate base session permissions permanently

## 6. Audit Requirements
Audit entry should include:
- action name
- requesting user
- approving user
- timestamp
- workstation / terminal if available
- transaction reference if applicable

## 7. Error Cases
```ts id="jz4z63"
type SensitiveActionAuthErrorCode =
  | "OVERRIDE_NOT_ALLOWED"
  | "OVERRIDE_APPROVER_INVALID"
  | "OVERRIDE_PERMISSION_DENIED"
  | "OVERRIDE_AUTH_FAILED";
```

## 8. Acceptance Criteria
- unauthorized sensitive action cannot proceed silently
- valid override allows only the intended action
- override is auditable

## 9. Agent Restrictions
- DO NOT elevate session permanently after override
- DO NOT approve action without audit logging