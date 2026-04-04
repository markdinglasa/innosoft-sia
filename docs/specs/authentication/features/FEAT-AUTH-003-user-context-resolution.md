# FEATURE SPEC — User Context Resolution

## Feature ID
FEAT-AUTH-003

## Epic ID
EPIC-AUTH-002

## Title
User Operational Context Resolution

## Objective
Resolve the complete identity context required for downstream modules after login.

## Description
After successful authentication, the system must resolve:
- UserId
- Display Name
- UserType
- RoleId / RoleIds
- active status
- branch access profile
- terminal eligibility if applicable

## User Story
As a system, I want to resolve the authenticated user's operational context so that the app can behave correctly and securely.

## Acceptance Criteria
- Given successful login, When context resolution runs, Then the system MUST resolve the user’s UserType.
- Given the user has assigned role(s), When context resolution runs, Then the role assignment MUST be included in session context.
- Given the user is missing required structural assignments, When context resolution runs, Then login MUST fail safely or require explicit resolution depending on policy.

## Rules
- UserType must be resolved as a first-class property
- Role must not substitute for UserType
- incomplete operational context must not silently degrade into unrestricted access

## Dependencies
- User Masterfile
- Role Masterfile
- Branch Access Masterfile
- UserType-Based UI Module

## Risks
- missing user setup records
- treating Role and UserType as the same field