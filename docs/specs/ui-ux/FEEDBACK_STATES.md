# UI/UX — FEEDBACK STATES
Version: 1.0.0
Owner: Frontend Architecture
Status: Draft
Module: Renderer (Electron + React + Vite)

---

# 1. Purpose

This document standardizes how the application communicates system state to the user.

Feedback is not cosmetic.
In a POS system, feedback is part of **operational safety**.

The user must always understand:
- what is happening
- whether it worked
- whether it failed
- what they should do next

---

# 2. Core Principles

## 2.1 No Silent Failure
The system MUST NEVER fail silently.

## 2.2 Immediate Feedback
Every user-triggered action must produce visible feedback within:
- 100ms for local UI reactions
- 500ms for async state acknowledgment

## 2.3 Actionable Messaging
Messages must tell the user:
- what happened
- what it means
- what they can do

## 2.4 Safe Under Pressure
Feedback must remain understandable during:
- high transaction volume
- offline conditions
- hardware issues
- manager override flows

---

# 3. Feedback Taxonomy

Every UI feedback event MUST be one of the following:

1. Loading
2. Success
3. Warning
4. Error
5. Empty
6. Disabled / Restricted
7. Offline / Sync
8. Pending Approval / Authorization
9. Informational / Passive Status

---

# 4. Global Rules

## 4.1 Every async action MUST define:
- loading state
- success state
- failure state

## 4.2 Every destructive action MUST define:
- confirmation state
- in-progress state
- completed state
- rollback or audit message if applicable

## 4.3 Every screen MUST define:
- initial loading state
- empty state
- recoverable error state

---

# 5. Loading States

## 5.1 Purpose
Loading states prevent uncertainty and accidental duplicate actions.

## 5.2 Loading Types

### A. Inline Loading
Use for:
- field-level lookups
- table refresh
- child collection updates

Examples:
- button spinner
- row skeleton
- dropdown loading

### B. Section Loading
Use for:
- panel reloads
- page subregions
- sidebars
- tabs

Examples:
- card skeleton
- list placeholder

### C. Page Loading
Use for:
- route entry
- workspace switch
- first-load data fetch

Examples:
- full-page skeleton
- shell-preserving page loader

### D. Blocking Loading
Use for:
- transaction commit
- void processing
- end-of-day closing
- license activation

Examples:
- modal overlay
- action lock screen

---

# 6. Loading Rules

## MUST
- show loading if operation > 150ms
- disable duplicate submission while loading
- preserve context where possible
- keep layout stable to avoid jumpiness

## MUST NOT
- freeze the entire screen unless necessary
- show both spinner and skeleton for same element
- hide previous content without reason
- leave loading indefinite without timeout/fallback messaging

---

# 7. Success States

## 7.1 Purpose
Success feedback confirms system trust.

## 7.2 Success Types

### A. Passive Success
Use for:
- saved setting
- updated record
- applied filter

Examples:
- small toast
- check icon label

### B. Transactional Success
Use for:
- checkout complete
- order held
- payment accepted
- sync completed

Examples:
- strong toast
- success banner
- celebratory animation (optional)

### C. Persistent Success
Use for:
- activation success
- printer configured
- terminal linked

Examples:
- inline confirmation card
- success state panel

---

# 8. Success Rules

## MUST
- be concise
- confirm the business outcome
- visually differentiate from warnings/errors
- avoid excessive interruption for routine saves

## Example Good
- “Item saved successfully.”
- “Transaction completed.”
- “Printer connected.”

## Example Bad
- “Success”
- “Done”
- “Okay”

---

# 9. Warning States

## 9.1 Purpose
Warnings communicate risk or unusual conditions without full failure.

Use for:
- low stock
- printer disconnected but retry possible
- negative stock allowed
- unsaved changes
- offline mode entered
- stale data warning

## Warning Rules
- must explain consequence
- must indicate whether user can continue
- must not be styled the same as hard errors

---

# 10. Error States

## 10.1 Purpose
Errors stop or degrade expected workflow and require correction or recovery.

## 10.2 Error Types

### A. Validation Error
Examples:
- missing required field
- invalid barcode
- duplicate SKU
- invalid amount

### B. Permission Error
Examples:
- unauthorized route
- restricted action
- manager approval required

### C. Operational Error
Examples:
- printer unavailable
- DB connection lost
- failed save

### D. Sync Error
Examples:
- cloud push failed
- local queue conflict

### E. Concurrency Error
Examples:
- outdated record
- inventory changed during checkout

---

# 11. Error Rules

## MUST
- identify what failed
- avoid technical jargon where unnecessary
- provide recovery path where possible
- preserve user input when safe

## MUST NOT
- say only “Something went wrong”
- discard form/cart silently
- expose raw SQL or internal stack traces to users

## Good Error Example
“Unable to save Item. SKU already exists.”

## Better Error Example
“Unable to save Item because SKU ‘ABC-123’ already exists. Please use a unique SKU.”

---

# 12. Empty States

## 12.1 Purpose
Empty states should guide, not confuse.

Use for:
- no products found
- no held orders
- no reports in date range
- no printer configured
- no branch selected

## Empty State Must Include
- clear explanation
- optional next action
- optional CTA

## Good Example
“No held orders found. New held orders will appear here.”

## Better Example
“No products match your search. Try another keyword or clear filters.”

---

# 13. Disabled / Restricted States

## 13.1 Purpose
Explain why an action is unavailable.

Use for:
- no permission
- no active terminal
- license restriction
- accounting period closed
- branch mismatch
- incomplete required setup

## Rule
A disabled action MUST explain why.

Allowed methods:
- tooltip
- helper text
- inline message
- status banner

Forbidden:
- dead buttons with no explanation

---

# 14. Offline & Sync States

## 14.1 Purpose
Offline-first systems must maintain user trust under unstable connectivity.

## Required Offline States
- offline mode active
- sync pending
- sync in progress
- sync success
- sync partial failure
- sync blocked

## UI Surfaces
- header badge
- footer progress
- queue count
- retry CTA
- failed queue review

## Example Messages
- “Offline Mode Active — transactions will sync later.”
- “Syncing 3 of 12 transactions…”
- “2 transactions failed to sync. Review required.”

---

# 15. Authorization & Approval States

Use for:
- void
- discount override
- price override
- Z-read
- sensitive manager actions

## Required Feedback Flow
1. action attempted
2. auth required modal
3. approval success/failure
4. audit-safe result message

## Must
- not expose who has which PIN unnecessarily
- not allow silent bypass
- not proceed if approval fails

---

# 16. Cart & POS Critical Feedback States

These are mandatory for the transaction screen.

## Required Events
- item added
- item removed
- quantity updated
- discount applied
- stock warning
- payment accepted
- payment rejected
- order held
- order recalled
- transaction completed
- printer issue
- sync queue update

## UX Rules
- cart changes must feel immediate
- payment failure must be unmistakable
- success must not hide receipt/next step options
- high-frequency feedback should avoid notification spam

---

# 17. Feedback Surface Mapping

## 17.1 Toast
Use for:
- short-lived non-blocking status
- success/warning/error messages

Best for:
- “Saved”
- “Copied”
- “Printer disconnected”

Not for:
- detailed form validation
- long explanations
- critical irreversible confirmations

---

## 17.2 Inline Helper/Error Text
Use for:
- field-level validation
- small contextual guidance

Best for:
- form fields
- payment inputs
- terminal selection

---

## 17.3 Banner / Alert Strip
Use for:
- route-level warnings
- offline status
- permissions
- stale data notices

---

## 17.4 Dialog / Modal
Use for:
- blocking confirmations
- manager authorization
- unrecoverable warnings
- destructive actions

---

## 17.5 Skeletons
Use for:
- page/section/list loading
- preserving layout while data loads

---

## 17.6 Badge / Chip / Status Icon
Use for:
- persistent lightweight state
- printer status
- sync queue count
- role status
- license status

---

# 18. Message Writing Standards

## MUST
- use plain language
- be concise
- mention business object when relevant
- be respectful and calm

## SHOULD
- include next step when needed
- use consistent verbs:
  - Saved
  - Updated
  - Deleted
  - Voided
  - Synced
  - Failed
  - Requires Approval

## MUST NOT
- use sarcastic or playful language in operational errors
- overuse exclamation marks
- use vague technical-only terms

---

# 19. Severity Mapping

## Info
Use for:
- general status
- guidance
- harmless state changes

## Success
Use for:
- completed intended actions

## Warning
Use for:
- risky but recoverable situations

## Error
Use for:
- failed or blocked actions

## Critical
Use for:
- data integrity risk
- checkout failure
- end-of-day issues
- license/auth lockouts

---

# 20. Accessibility Rules for Feedback

All feedback must be accessible.

## Required
- screen-reader friendly labels
- icon + text, not color only
- sufficient contrast
- keyboard dismissibility where appropriate
- focus management for blocking dialogs

## For Toasts
- must not disappear too quickly if critical
- must be announced accessibly if possible

---

# 21. Anti-Patterns (Forbidden)

## Forbidden
- loading spinner forever
- silent form failure
- duplicate stacked toasts
- success toast on failed operation
- blocking modal for trivial success
- error messages with no recovery path
- hidden offline mode
- disabled actions with no explanation
- red error state for warning-level issues

---

# 22. Implementation Contract

Every new UI workflow must define:

- loading behavior
- success behavior
- warning behavior
- error behavior
- empty behavior (if list/data driven)
- permission behavior (if sensitive)
- offline/sync behavior (if network or queue dependent)

---

# 23. Definition of Done

A feedback implementation is complete only if:

- [ ] every async action has loading/success/error states
- [ ] every form has validation feedback
- [ ] every destructive action has confirmation feedback
- [ ] every route has loading/empty/error handling
- [ ] offline/sync states are visible where applicable
- [ ] feedback language is user-friendly
- [ ] feedback is accessible
- [ ] feedback does not spam or confuse the user

---