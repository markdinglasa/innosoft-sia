# FEATURE SPEC — Cashier Workspace

## Feature ID
FEAT-UTUI-002

## Epic ID
EPIC-UTUI-001

## Title
Cashier Workspace

## Objective
Provide a payment-centric workspace optimized for transaction settlement, cash handling, and queue fulfillment.

## Description
Cashier users are responsible for:
- tendering
- payment collection
- receipt issuance
- suspended order recall
- cash drawer operations
- shift reading support

The workspace must optimize:
- speed of payment entry
- order recall
- quick-cash actions
- settlement visibility

## User Story
As a Cashier, I want a workspace optimized for payment and order settlement so that I can process customers quickly and accurately.

## Acceptance Criteria
- Given a Cashier logs in, When workspace resolves, Then the app MUST load the Cashier shell.
- Given the Cashier workspace is shown, When the main screen renders, Then suspended order recall, receipt lookup, and payment tools MUST be prominent.
- Given a Pay action is triggered, When the tendering panel opens, Then quick-cash denomination buttons and numeric input MUST be prioritized.
- Given the Cashier is on shift, When drawer operations are needed, Then Drop/Payout and X/Z reading entry points MUST be immediately accessible if permitted.

## UX Requirements
- large payment keypad support
- high-speed numeric entry
- receipt recall workflow
- suspended order retrieval
- shift utility visibility

## Rules
- Cashier workspace may include ordering assistance, but tendering must remain the dominant workflow
- Cashier shell must not expose admin-heavy navigation by default

## Dependencies
- Transaction Module
- Role Permission Resolution
- Sensitive Action Authorization

## Risks
- cluttering cashier UI with management tools
- exposing settlement controls to users lacking permission

## Agent Notes
Cashier workspace is not “Admin POS with fewer buttons.”
It is a dedicated operational shell.