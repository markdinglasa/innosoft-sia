# TECH-UIX-009 — Shortcut Engine

## Goal

- Provide a centralized keyboard action framework.

## Requirements

- Shortcut registry
- context-aware activation
- permission-aware action execution
- protected input opt-out
- discoverability sheet/help overlay

## Hard Rule

- Do not scatter window.addEventListener('keydown', ...) all over the app.
- That becomes frontend spaghetti very quickly.