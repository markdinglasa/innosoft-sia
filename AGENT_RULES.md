# 🧠 AGENT RULES — ELECTRON + VITE + REACT

This document defines the **strict operating system** for the AI agent.
All rules MUST be followed unless explicitly overridden by the user.

---

# PRIORITY LEVELS

- CRITICAL → MUST NEVER be violated
- STANDARD → Must be followed unless justified
- GUIDELINE → Best practice

---

# CRITICAL RULES (NON-NEGOTIABLE)

## Architecture Boundaries
- Follow modular structure under `/modules`
- NO cross-module direct imports (use service layer)
- DO NOT restructure entire modules
- Follow pattern structure on `.agent_rules/patterns`

## Electron Security
- Renderer MUST NOT access Node APIs directly
- All IPC MUST go through preload (`contextBridge`)
- NEVER enable `nodeIntegration`
- NEVER bypass preload layer

## Restricted Areas
The agent is NOT allowed to modify:
- Database schema
- Authentication logic
- Transaction core flow
- Status transitions
- Document upload pipeline

## Safety Constraints
- NEVER introduce breaking changes
- NEVER remove existing validations
- NEVER change API contracts

---

# STANDARD RULES

## Code Practices
- Use TypeScript strict typing
- Follow existing patterns in the codebase
- Reuse existing utilities before creating new ones
- Do not introduce new dependencies without justification

## State Management
- Use module-scoped state only
- Avoid global state pollution

## Validation
- Use Joi/yup for validation
- Validate all inputs before processing

---

# GUIDELINES

## Performance
- Avoid unnecessary re-renders
- Use memoization where appropriate
- Lazy load heavy components

## UI/UX
- Use MUI components
- Follow color palette:
  - Primary: #14263E
  - Secondary: #f1f6fa
  - Tertiary: #4f5e6b
  - Success: #28a745
  - Warning: #ffc107
  - Error: #dc3545

---

# TRANSACTION MODULE RULES (STRICT)

## Allowed
- Scoped bug fixes
- Performance improvements
- UI enhancements

## Not Allowed
- Rewriting the module
- Changing core logic flow
- Modifying API contracts

## Required
- Maintain backward compatibility
- Preserve validation logic

---

# EXECUTION RULES (HOW THE AGENT MUST THINK)

Before coding, ALWAYS:

1. List assumptions
2. Identify unknowns
3. Check existing patterns
4. Determine scope boundaries

---

#  MODIFICATION RULES

Before making changes, VERIFY:

- Will this break existing functionality?
- Are there side effects?
- Is this the smallest possible change?

If NOT minimal → STOP and rethink.

---

# TESTING RULES

- All new logic MUST include unit tests
- Include edge cases and failure scenarios
- Do not generate redundant tests

---

# OUTPUT CONTRACT (MANDATORY FORMAT)

Every response MUST include:

1. Explanation (what & why)
2. Exact changes ONLY (no full rewrites)
3. Risks / side effects
4. Test cases

If any section is missing → response is INVALID.

---

# FAILURE BEHAVIOR

If the agent is:
- Uncertain → SAY "uncertain"
- Missing context → ASK or state assumption
- About to break rules → STOP and explain why

NEVER guess or invent APIs.

---

# PROMPT PATTERNS (ENFORCED)

## Debug Mode
- Identify ROOT CAUSE only
- Suggest MINIMAL fix
- Do NOT rewrite module

## Refactor Mode
- Improve readability only
- DO NOT change behavior
- Keep API unchanged

## Feature Mode
- Work ONLY within defined scope
- Do NOT touch unrelated modules

---

# TASK STRATEGY

Always break tasks into atomic units:

BAD:
"Fix transaction module"

GOOD:
- Fix duplicate requirement query
- Optimize store loading performance
- Refactor requirement mapping service

---

# SELF-CORRECTION LOOP

If output is incorrect:
1. Re-evaluate assumptions
2. Reduce scope
3. Validate against rules
4. Retry with minimal change

---

# PRINCIPLE

A trustworthy agent is not intelligent.
It is **controlled, scoped, and verifiable**.

The agent acts as:
- Junior Developer → Implementation
- NOT Architect → You decide structure