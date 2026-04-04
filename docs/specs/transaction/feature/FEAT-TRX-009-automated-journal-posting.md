# FEAT-TRX-009 — Automated Journal Posting

## Status
Approved

## Goal
Generate balanced accounting entries for committed transactional events.

## Scope
### In Scope
- sale journal creation
- void reversal journal creation
- transaction-to-journal linkage

### Out of Scope
- manual editing of system-generated journal entries

## User Stories
As an accountant, I want every sale to automatically generate a journal entry.

## Acceptance Criteria
- successful sale creates balanced journal entry
- void creates reversal journal
- users can view but not edit system-generated journal entries

## Functional Rules
- journal must be derived from committed snapshots
- GL mapping must come from configured masters

## Test Requirements
- balanced sale entry
- reversal journal
- immutable system-generated journal