# FEATURE SPEC — Role and Permission Hydration

## Feature ID
FEAT-AUTH-004

## Epic ID
EPIC-AUTH-002

## Title
Role and Permission Hydration

## Objective
Load the user's effective permissions into the authenticated session.

## Description
Once the user's role assignment is known, the system must hydrate the effective permissions required for:
- route access
- action visibility
- sensitive operation checks
- manager override validation

## User Story
As a system, I want to hydrate role permissions at login so that authorization checks are fast and consistent.

## Acceptance Criteria
- Given a user has an assigned role, When session initializes, Then the system MUST resolve all effective permissions.
- Given permissions are changed after login, When policy requires refresh, Then the session MUST rehydrate or invalidate accordingly.
- Given a protected action is requested, When permission is checked, Then the check MUST use the centralized hydrated permission state.

## Rules
- permissions must not be inferred from role name text
- permission hydration must be centralized
- missing permissions should default to deny

## Dependencies
- Role Masterfile
- Permission Master
- Authorization Checking

## Risks
- stale permission state
- scattered permission resolution logic