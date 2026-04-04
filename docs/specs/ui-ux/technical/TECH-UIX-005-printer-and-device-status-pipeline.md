# TECH-UIX-005 — Printer & Device Status Pipeline

## Goal

- Provide consistent device health visibility.

## Flow

IPC → Device Service → Redux Hardware Slice → Header / Notifications / Diagnostic UI

## Rules

- Device status must be passive and non-blocking by default
- Checkout should only block if printer is configured as “required before sale completion” (branch setting)
- Renderer must not speak directly to hardware