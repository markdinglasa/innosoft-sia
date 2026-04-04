# TSS-TRX-008 — Sensitive Override Authorization

## Purpose
Define restricted action approval flows.

## Rules
- override must require permission or manager approval
- approval must be action-scoped
- approval must be logged
- approval must not permanently elevate the acting user

## Sensitive Actions
- price override
- discount override
- negative stock exception
- void approval
- reprint approval

## Required Tests
- denied approval
- approved override
- audit creation
- no permission bypass