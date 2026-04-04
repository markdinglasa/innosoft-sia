# FEATURE SPEC — Authorization Checking

## Feature ID
FEAT-AUTH-007

## Epic ID
EPIC-AUTH-003

## Title
Authorization Checking

## Objective
Provide a centralized and deterministic way to validate access to protected routes and actions.

## Description
Authentication establishes identity.
Authorization determines whether the current session may perform a requested action.

This includes:
- route checks
- feature checks
- button/action checks
- backend operation checks

## User Story
As a system, I want to evaluate access requests consistently so that protected actions cannot be executed without permission.

## Acceptance Criteria
- Given a protected action, When requested, Then the system MUST evaluate authorization before execution.
- Given authorization fails, When access is denied, Then the app MUST block execution safely.
- Given authorization checks run in the UI, When a sensitive action proceeds, Then the backend/service layer MUST still validate authorization again.

## Rules
- authorization defaults to deny
- UI checks are not sufficient security
- all sensitive operations require service-level authorization validation

## Dependencies
- Role and Permission Hydration
- UserType-Based UI Module
- IPC / Main Process Services

## Risks
- relying only on renderer checks
- duplicated authorization logic