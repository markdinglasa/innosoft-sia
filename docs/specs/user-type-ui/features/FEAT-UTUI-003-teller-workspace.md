# FEATURE SPEC — Teller Workspace

## Feature ID
FEAT-UTUI-003

## Epic ID
EPIC-UTUI-001

## Title
Teller Workspace

## Objective
Provide a speed-focused order-entry workspace optimized for cart building, modifiers, and order dispatch.

## Description
Teller users are responsible for:
- taking orders
- selecting products quickly
- applying modifiers
- suspending/sending carts
- passing orders downstream

The Teller workspace should avoid clutter from:
- tendering
- cash handling
- admin controls

## User Story
As a Teller, I want a fast visual ordering workspace so that I can take customer orders quickly and accurately.

## Acceptance Criteria
- Given a Teller logs in, When workspace resolves, Then the app MUST load the Teller shell.
- Given the Teller workspace is shown, When the main screen renders, Then product tiles, categories, and cart panel MUST be prioritized.
- Given an order is completed, When the Teller clicks Send or Suspend, Then the system MUST create the downstream order handoff and clear or reset the cart according to transaction rules.
- Given the Teller lacks tendering rights, When using the cart, Then tendering and cash settlement controls MUST not be available.

## UX Requirements
- image-rich product browsing
- category-first ordering flow
- visible cart summary
- rapid modifier interaction
- minimal friction between customers

## Rules
- Teller shell should prioritize speed over reporting or settlement
- Teller workspace must not expose cash controls unless explicitly cross-permitted

## Dependencies
- Transaction Module
- Permission-Aware Actions
- Workspace Shell Resolution

## Risks
- Teller shell accidentally exposing financial actions
- “hidden but still callable” actions

## Agent Notes
Do not implement Teller as just a restricted Cashier screen.
It is its own workflow.