# TECH SPEC — Session Lock and Expiry Policy

## 1. Spec ID
TECH-AUTH-007

## 2. Objective
Define when sessions should lock, expire, or require full re-authentication.

## 3. Policy Layers
### Idle Lock
Used for temporary workstation inactivity.

### Full Expiry
Used for total session lifetime or strict security timeout.

## 4. Required Rules
- idle lock should preserve safe resumable context where allowed
- full expiry must require full authentication
- lock must not silently bypass secure checks

## 5. Transaction Safety
If lock occurs during critical transaction operations:
- transaction write path must finish or fail atomically
- partial save states must not be created

## 6. Acceptance Criteria
- idle lock and full expiry behave differently and predictably
- resumed sessions are secure

## 7. Agent Restrictions
- DO NOT lock in the middle of unsafe write state without transaction-aware handling