# Transaction Module Rules

## Core Rules
- Must work offline
- Must never lose committed transaction data
- Must preserve auditability
- Must use TypeScript strict typing
- Must use service-layer architecture

## Architecture Rules
- No direct DB calls from renderer
- No Electron API access from renderer except through preload
- No business-critical logic buried inside UI components
- No giant god-file implementation

## Required Separation
- cart engine
- calculation engine
- tender engine
- commit service
- inventory sync service
- print service
- void service
- cash movement service
- shift session service
- audit service

# Transaction IPC Contract Rules

## Required Rule
All transaction IPC payloads must be validated before business logic execution.

## Validation Layer
Use:
- Zod

## Must Validate
- cart payloads
- tender payloads
- commit payloads
- hold payloads
- void payloads
- cash movement payloads
- shift payloads
- override authorization payloads

## Forbidden
- raw any payload execution
- unvalidated nested arrays
- trusting renderer-computed authoritative totals


# Transaction Testing Rules

## Required Test Categories
- unit tests
- integration tests
- security/integrity tests
- performance tests

## Mandatory Coverage
- calculations
- tendering
- commit rollback
- stock deduction
- held orders
- voids
- cash movements
- shift enforcement
- override authorization

## Rule
No critical transactional feature should be marked complete without:
- acceptance criteria verification
- automated test coverage
- negative-path validation