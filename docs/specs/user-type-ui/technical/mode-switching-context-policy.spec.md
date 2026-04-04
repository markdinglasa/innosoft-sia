# TECH SPEC — Mode Switching Context Policy

## 1. Spec ID
TECH-UTUI-005

## 2. Objective
Define safe behavior for temporary workspace mode switching.

## 3. Problem Statement
Mode switching can create security confusion if it is mistaken for permission elevation.

## 4. Policy Principle
Mode switching changes **workspace shell context**, not permission authority.

## 5. Allowed Example
- Administrator opens Cashier Mode shell
- but still only actions allowed by assigned Role(s) are executable

## 6. Required Rules
- mode switching must be explicit
- source and target mode must be recorded in UI state
- current transaction/cart context handling must be deterministic
- returning to original workspace must be supported safely

## 7. Recommended Constraints
- disallow mode switching during in-progress sensitive actions
- optionally require clean state before switching

## 8. Acceptance Criteria
- switching workspace does not grant new permissions
- switching workspace does not corrupt active context
- returning to original workspace works safely

## 9. Agent Restrictions
- DO NOT equate mode switch with role escalation
- DO NOT silently preserve unsafe in-progress state