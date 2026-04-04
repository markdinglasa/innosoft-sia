
# AUTHENTICATION MODULE — IMPLEMENTATION RULES

## 1. Authentication Is a Core Trust Boundary
Authentication must be treated as a system boundary, not a UI convenience.

It must be implemented as a trusted backend/main-process concern.

---

## 2. Renderer Must Never Own Authentication Logic
React / renderer may:
- collect credentials
- display auth state
- show validation feedback

React / renderer must NOT:
- verify passwords
- compare hashes
- directly query user auth tables
- make authorization decisions as the only enforcement layer

---

## 3. UserType and Role Must Remain Separate
Authentication must resolve both:
- UserType (static workspace identity)
- Role / Permissions (dynamic authorization)

Never collapse these into one field.

---

## 4. Session Must Be Canonical
All modules must consume one canonical authenticated session object.

Avoid per-module session assumptions.

---

## 5. Permissions Must Be Explicit
Permissions must be hydrated into session state using:
- role assignments
- centralized access-right definitions

Never infer permissions from labels or UI assumptions.

---

## 6. Branch and Terminal Must Be Part of Auth Context
Authentication is not complete until operational context is valid.

For POS usage, that means:
- active branch must be known
- active terminal must be valid where required

---

## 7. Session Must Be Time-Bound
Support:
- idle lock
- full expiry
- logout invalidation
- optional restore with integrity validation

---

## 8. Manager Approval Must Be Separate
Manager override approval is not permission mutation.

It is:
- temporary
- action-bound
- auditable
- independently authenticated

---

## 9. All Sensitive Operations Must Re-Validate
Even if the UI thinks the user is authenticated or authorized, sensitive operations must still validate through:
- preload bridge
- IPC validation
- main process services

---

## 10. Offline-First Rule
Authentication should work offline-first using trusted local data.

If online verification exists (for licensing or sync), it must not break core offline operation unless explicitly required by business policy.