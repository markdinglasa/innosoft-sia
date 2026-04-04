# TSS-TRX-002 — Atomic Commit Orchestrator

## Purpose
Define the exact order of operations for transaction commit.

## Commit Sequence
1. validate active shift/session
2. validate IPC payload schema
3. reload authoritative item/price/tax data
4. recompute totals
5. validate permissions / overrides
6. validate stock policy
7. insert transaction header
8. insert transaction lines
9. insert modifiers / notes
10. insert discounts
11. insert payments
12. insert tax snapshots
13. insert audit events
14. insert accounting payload / journal stub
15. insert inventory ledger entries
16. update stock balances
17. commit DB transaction
18. trigger post-commit outputs

## Hard Rules
- all steps before DB commit must be inside one DB transaction where applicable
- any failure must rollback entire commit
- printing must never be part of the DB transaction
- commit should support duplicate submission protection via clientCommitId

## Required Tests
- rollback on step failure
- duplicate commit prevention
- inventory mismatch rejection