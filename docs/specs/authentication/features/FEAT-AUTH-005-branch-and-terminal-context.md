# FEATURE SPEC — Branch and Terminal Context

## Feature ID
FEAT-AUTH-005

## Epic ID
EPIC-AUTH-002

## Title
Branch and Terminal Context Resolution

## Objective
Associate the authenticated session with the correct branch and terminal operational context.

## Description
POS operations depend heavily on branch and terminal context.

Authentication must resolve:
- which branches the user may access
- which branch is active for this session
- whether a terminal must be selected or pre-bound
- whether the terminal is valid for the branch

## User Story
As a system, I want to establish the correct branch and terminal context during login so that transactions and reports operate under the correct operational scope.

## Acceptance Criteria
- Given a user has multiple branch access assignments, When logging in, Then the system MUST resolve or require branch selection according to policy.
- Given a terminal is required, When session starts, Then the system MUST validate the active terminal before entering the operational workspace.
- Given a terminal does not belong to the selected branch, When validation occurs, Then login/session activation MUST be blocked.

## Rules
- branch context must exist before transaction workflows begin
- terminal validation must not be optional for terminal-bound operations
- invalid branch-terminal pairing must fail safely

## Dependencies
- Branch Access Masterfile
- Terminal Masterfile
- Settings Module
- Transactions Module

## Risks
- cross-branch contamination
- wrong terminal assignment
- incorrect report scoping