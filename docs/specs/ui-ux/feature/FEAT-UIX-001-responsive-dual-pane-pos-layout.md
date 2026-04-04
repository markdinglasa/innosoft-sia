# FEAT-UIX-001 — Responsive Dual-Pane POS Layout
## Goal

- Provide a persistent cart + product interaction layout that remains usable across desktop and compact resolutions.

## Functional Requirements
- Fixed cart panel on wide screens
- Sticky totals and Charge CTA
- Collapsible cart drawer on smaller resolutions
- Preserve line visibility while browsing products

## UX Rules
- Product browsing must never hide transaction context
- Totals must remain visible at all times
- Cart collapse must always show line count + total amount

## Acceptance Criteria
- Cart sidebar must remain visible while product area scrolls
- Totals and primary checkout CTA remain pinned
- On compact widths, cart becomes a drawer without losing state

## Components
- POSShell
- CartSidebar
- CartSummaryBar
- CatalogGrid
- ResponsiveCartDrawer