# Keyboard Shortcuts Spec

## Purpose
This document defines the official keyboard interaction model for the POS application.

The POS must be usable at high speed with:
- hardware barcode scanners
- keyboard-heavy operators
- minimal pointer dependence

---

# 1. Keyboard Design Philosophy

Shortcuts must be:

- fast
- memorable
- conflict-aware
- safe for retail workflows
- not destructive by accident

Critical actions must never be too easy to trigger accidentally.

---

# 2. Global Rules

## 2.1 Global shortcuts must work only in appropriate contexts
Example:
- `Ctrl + K` should work almost everywhere
- `F9 Charge` should only work inside an active POS flow

---

## 2.2 Text inputs must be respected
When the user is actively typing in:
- search fields
- notes
- forms
- quantity entry
- customer details

The app must not hijack normal typing unless explicitly intended.

---

## 2.3 Dangerous shortcuts require guardrails
Actions like:
- void
- payout
- close shift
- manager override

Must not be bound to single accidental keys without confirmation.

---

# 3. Recommended Global Shortcuts

## App-Level
- `Ctrl + K` → Open Command Palette
- `Ctrl + /` → Open Shortcut Help
- `Ctrl + ,` → Open Settings (if permitted)
- `Esc` → Close active modal/drawer/popover
- `F1` → Help / Operational Guide
- `F5` → Soft refresh current screen state (not full app reload)

---

# 4. POS Workflow Shortcuts

## Item Entry / Search
- `Enter` → Confirm current focused item/search result
- `Ctrl + F` → Focus item search
- `Alt + C` → Focus cart
- `Alt + I` → Focus item catalog

---

## Cart Actions
- `+` or `=` → Increase selected line quantity
- `-` → Decrease selected line quantity
- `Delete` → Remove selected line (with confirmation if configured)
- `Ctrl + D` → Apply discount (if permitted)
- `Ctrl + Q` → Edit quantity
- `Ctrl + P` → Price override (manager permission/approval required)

---

## Order Lifecycle
- `F2` → Hold / Suspend current order
- `F3` → Recall held order list
- `F4` → Assign customer
- `F6` → Notes / Remarks
- `F8` → Open tender / payment screen
- `F9` → Charge / finalize transaction
- `F10` → Print / reprint current receipt (if permitted)

---

# 5. Cashier Financial Shortcuts

- `Ctrl + Shift + X` → X-Read
- `Ctrl + Shift + Z` → Z-Read (protected)
- `Ctrl + Shift + I` → Cash In
- `Ctrl + Shift + O` → Cash Out
- `Ctrl + Shift + R` → Receipt lookup / recall

These must be permission-aware.

---

# 6. Teller-Focused Shortcuts

Teller mode should prioritize speed and simplicity.

Recommended:
- Arrow keys → navigate product grid
- `Enter` → add highlighted product
- `Tab` → cycle categories / cart / actions
- `F2` → send/suspend order
- `F4` → modifiers
- `F8` → send to cashier / queue

Teller must not expose settlement shortcuts unless cross-permitted.

---

# 7. Administrator Shortcuts

Recommended:
- `Ctrl + N` → create new record
- `Ctrl + S` → save form
- `Ctrl + E` → edit selected row
- `Ctrl + Shift + F` → advanced filter
- `Ctrl + Export` equivalent:
  - `Ctrl + Shift + E` → export current table/report
- `Ctrl + B` → bulk action panel (if relevant)

---

# 8. Barcode Capture Rules

Barcode input is not a “shortcut,” but it behaves like a high-priority keyboard stream.

Rules:
- barcode capture must not leak partial characters into unrelated fields
- barcode capture must detect wedge-style fast input
- barcode handling must be context-aware
- if a modal requires text input, it may temporarily suspend barcode capture

---

# 9. Shortcut Conflict Rules

Forbidden:
- browser-reserved destructive conflicts
- shortcuts that differ wildly between UserTypes for the same action
- overloaded keys with multiple dangerous meanings

Try to keep:
- `F-keys` = POS actions
- `Ctrl combinations` = utility/system actions
- `Alt combinations` = focus/navigation actions

---

# 10. Discoverability Rules

Keyboard shortcuts must not be hidden tribal knowledge.

Must provide:
- a visible “Shortcuts” help modal
- tooltip hints where appropriate
- optional footer hints in POS mode

---

# 11. Agent-Safe Rules

Agents must not:
- add new shortcuts without checking conflicts
- assign destructive actions to single-key shortcuts casually
- bind keyboard events directly in random page components

Preferred implementation:
- centralized keyboard shortcut registry
- route-aware and modal-aware shortcut activation
- permission-aware action dispatch

---

# 12. Golden Rule

Shortcuts should make the POS faster — not more dangerous.