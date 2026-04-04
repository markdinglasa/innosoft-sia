
# TECH SPEC — Workspace Resolution Bridge

## 1. Spec ID
TECH-AUTH-003

## 2. Objective
Bridge Authentication output into UserType-Based UI workspace shell resolution.

## 3. Problem Statement
Authentication and UI must agree on a single authoritative source for workspace shell resolution.

## 4. Rule
Authentication must return `userType` in session bootstrap payload.

UserType UI module consumes that value to resolve shell.

## 5. Flow
1. login succeeds
2. auth resolves session context
3. auth returns userType
4. workspace resolver selects shell
5. landing route is computed
6. protected UI loads

## 6. Required Rules
- auth owns identity truth
- UI owns shell rendering
- role name must never be used as workspace shell selector

## 7. Acceptance Criteria
- login directly lands in correct shell
- invalid/missing userType fails safely

## 8. Agent Restrictions
- DO NOT duplicate workspace inference in multiple places