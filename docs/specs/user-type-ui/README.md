# USER TYPE-BASED UI MODULE — SDD INDEX

## Goal
Provide a specialized operational UI experience based on static UserType while enforcing dynamic Role permissions.

## Core Principle
The system separates:

- **UserType** → operational workspace mode (static)
- **Role** → authorization and permissions (dynamic)

## Static UserTypes
- Administrator
- Cashier
- Teller

## Dynamic Roles
Admin-configurable permission bundles that determine what actions a user may perform inside their assigned workspace.

## Behavioral Model
A user logs in with:
- one **UserType**
- one or more **Roles** (or one assigned Role depending on your auth design)

The app resolves:

1. workspace shell
2. allowed routes
3. visible actions
4. restricted actions
5. escalation requirements for sensitive actions

## This spec package defines
- workspace shells
- route behavior
- action guarding
- permission-aware UI
- manager override approval
- mode switching rules
- workstation UX boundaries