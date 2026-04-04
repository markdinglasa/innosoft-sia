# TECH-UIX-010 — Animation & Performance Budget

## Goal

- Keep the UI modern without harming operational speed.

## Rules

- Critical interaction animations: ≤150ms
- Page transitions: ≤200ms
- Never animate large lists naïvely
- Use virtualization for large result sets
- Avoid expensive glass/blur effects in high-frequency list areas

## Hard Rule

- A POS is not a Dribbble concept.
- If the animation slows checkout, it’s a bug.