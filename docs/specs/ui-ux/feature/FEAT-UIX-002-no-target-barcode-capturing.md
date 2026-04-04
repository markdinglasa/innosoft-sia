# FEAT-UIX-002 — No-Target Barcode Capturing
## Goal

Allow barcode scans regardless of input focus.

## Functional Requirements
- Global key capture provider
- Detect scanner-like burst input
- Route barcode to transaction engine
- Respect protected modals

## UX Rules
- Scanning must feel instant
- Users should not need to click a search box
- Scan feedback must be visible and optionally audible

## Acceptance Criteria
- Scans are captured from anywhere within active POS context
- Protected input modals may opt out explicitly
- Successful scan shows visual confirmation

## Components
- GlobalScannerProvider
- ScanFeedbackToast
- ScannerInputParser