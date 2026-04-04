# FEAT-UIX-004 — Visual Peripheral Health Monitor
## Goal

- Show real-time hardware readiness.

## Functional Requirements
- Header status for:
  - printer
  - scanner (optional availability)
  - cash drawer (if supported)
- Non-blocking hardware warnings
- Hardware detail drawer/modal

## Acceptance Criteria
- Printer status always visible in POS shell
- Error states are visible without blocking the current sale
- Hardware issue messaging must be actionable

## Components
- HardwareStatusHeader
- PrinterStatusBadge
- DeviceHealthPopover