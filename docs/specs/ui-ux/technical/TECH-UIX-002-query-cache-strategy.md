# TECH-UIX-002 — Query Cache Strategy

## Goal

- Make lookup-heavy UI fast without showing misleading stale data.

## Rules

- Use query keys per module and branch/terminal context
- Define cache tiers:
    - Hot Cache: items, customers, quick lookups
    - Warm Cache: reports, history
    - Cold Cache: settings metadata
- Use stale indicators where appropriate
- Preserve last successful data on refetch failures

## Example Query Key Pattern

```ts
['masterfile', 'items', branchId]
['reports', 'sales-summary', filters]
['trx', 'held-orders', terminalId]
```