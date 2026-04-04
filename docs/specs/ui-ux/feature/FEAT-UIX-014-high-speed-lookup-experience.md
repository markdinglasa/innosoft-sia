# FEAT-UIX-014 — High-Speed Lookup Experience
## Goal

- Allow fast fallback lookup when scanning is unavailable.

## Functional Requirements
- Exact barcode / SKU prioritization
- Fuzzy name search
- Keyboard navigation
- Recent/frequent items
- Customer and held-order search variants

## Acceptance Criteria
- Search results must appear quickly and be keyboard navigable
- Search ranking must prioritize exact machine-identifiable matches first
- Empty query may surface useful shortcuts or frequent items

## Components
- UniversalLookupInput
- LookupResultsPanel
- RecentItemsTray