# TECH-UIX-008 — UI Recovery & Failure State Engine

## Goal

- Prevent the UI from becoming misleading or destructive during failures.

## Must Handle

- failed save
- failed print
- failed lookup
- failed sync
- stale cache
- partial device outage
- route-level data load failure

## Rules

- Preserve last-good-state where safe
- Never clear cart on unconfirmed commit failure
- Printing failure must not imply transaction loss
- Retry must be explicit and deterministic