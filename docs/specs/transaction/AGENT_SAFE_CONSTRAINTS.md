# Transaction Agent Rules

## Agent MUST NOT
- rewrite the whole transaction module
- modify DB schema unless explicitly requested
- bypass preload
- bypass IPC validation
- bypass shift/session checks
- remove audit logs
- remove permission checks
- silently change rounding behavior
- silently change stock deduction behavior
- silently change tax logic
- commit directly from renderer

## Agent MAY
- fix scoped bugs
- improve readability
- improve type safety
- optimize renderer performance
- add tests
- refactor isolated services

## Agent MUST ALWAYS Output
1. Scope
2. Assumptions
3. Risks
4. Verification Plan
5. Test Cases