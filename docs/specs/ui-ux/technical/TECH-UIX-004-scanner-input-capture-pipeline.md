# TECH-UIX-004 — Scanner Input Capture Pipeline

## Goal

- Standardize how keyboard-wedge scans are captured.

## Pipeline

- Listen globally in active POS shell
- Buffer key burst
- Detect scanner cadence vs human typing
- Normalize payload
- Emit SCAN_RECEIVED
- Route to transaction engine / lookup handler

## Rules

- Ignore scan if shell is not scan-enabled
- Protected inputs may opt out
- Scans must not be lost during route transitions