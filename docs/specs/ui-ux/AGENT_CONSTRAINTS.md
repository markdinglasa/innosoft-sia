# UI/UX Agent Constraints

## Purpose
This file defines **strict boundaries** for AI agents working on the renderer.

The goal is to make frontend changes **safe, scoped, testable, and architecture-compliant**.

---

# 1. High-Level Agent Policy

AI agents are allowed to:
- improve UI structure
- build new pages/components
- refactor presentation logic
- improve accessibility
- add loading/error/empty states
- wire Redux/TanStack Query usage correctly
- add keyboard shortcuts
- add safe route guards
- optimize render performance

AI agents are NOT allowed to:
- invent backend APIs
- bypass preload/IPC
- directly access Electron internals from React
- alter financial business logic in UI
- weaken permission enforcement
- remove confirmations on sensitive actions
- rewrite the whole transaction screen without scoped approval

---

# 2. Mandatory Pre-Work Before Coding

Before changing any UI code, the agent MUST first determine:

1. What page or feature is being changed?
2. Is the change:
   - visual only
   - state-related
   - route-related
   - permission-related
   - keyboard-related
3. Does an existing reusable component already exist?
4. Is this change safe for:
   - Administrator
   - Cashier
   - Teller
5. Does the feature touch:
   - auth/session
   - transaction flow
   - hardware state
   - protected actions

If yes, the agent must proceed conservatively.

---

# 3. Scope Constraints

## 3.1 Never rewrite entire screens unless explicitly requested
Forbidden:
- replacing a complete POS page to fix one bug
- restructuring the entire app shell for a single button issue
- changing all navigation just to add one menu item

Preferred:
- minimal, localized change
- preserve behavior
- preserve existing contracts

---

## 3.2 No “cleanup refactors” inside critical flows unless requested
Critical flows:
- login
- session restore
- checkout
- hold/recall
- void
- payment
- shift close
- route guards

Agents must not opportunistically refactor these areas during unrelated work.

---

# 4. State Constraints

## 4.1 Do not move state across Redux / Query / local state without justification
Any migration of state must explain:

- why the current location is wrong
- why the new location is correct
- what side effects are affected

Forbidden:
- “I moved everything to Redux for convenience”
- “I replaced Redux with local state”
- “I cached all mutations manually”

---

## 4.2 Do not duplicate authoritative state
Forbidden:
- storing fetched query data redundantly in Redux without reason
- duplicating permission state in multiple slices
- maintaining separate route guard truth tables in several files

Single source of truth must be preserved.

---

# 5. Permission & Security Constraints

## 5.1 Never implement UI-only security
Agents must not assume:
- hidden button = secured action
- hidden route link = access blocked
- disabled UI = permission enforcement

Must preserve:
- route guard
- permission hook
- backend/main-process validation

---

## 5.2 Sensitive actions must remain friction-protected
Agents must not remove or weaken:
- manager PIN prompts
- confirmation dialogs
- reason fields
- warning banners
- audit labels

Unless explicitly approved.

---

# 6. UX Constraints

## 6.1 Do not prioritize “beautiful” over “operationally fast”
Forbidden:
- slow heavy transitions on scan workflows
- oversized decorative animations in POS flows
- modal chains for common cashier actions
- excessive glassmorphism that reduces readability

The POS is a tool first, aesthetic second.

---

## 6.2 Avoid hidden interactions for critical tasks
Critical tasks must not rely only on:
- hover
- swipe
- long press
- secret gestures

Every critical task must also have an obvious visible fallback.

---

# 7. Data Loading Constraints

## 7.1 Never block the whole screen for small data fetches
Use:
- skeletons
- partial loading states
- stale data retention
- background refresh

Avoid:
- full-page spinner for every tiny refresh
- wiping tables during refetch

---

# 8. Testing Constraints

Any meaningful UI change must include test implications for at least one of:

- role visibility
- route guarding
- loading/error/empty state
- keyboard shortcut behavior
- mutation success/failure feedback
- accessibility/focus handling

---

# 9. Output Requirements for Agents

Every agent response must include:

1. **What changed**
2. **Why it changed**
3. **Files touched**
4. **Risks**
5. **How to test**
6. **What was intentionally NOT changed**

This is mandatory for trustworthiness.