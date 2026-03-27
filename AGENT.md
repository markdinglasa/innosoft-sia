# 🧠 AGENT RULES — ELECTRON + VITE + REACT

This document defines the **strict operating system** for the AI agent.
All rules MUST be followed unless explicitly overridden by the user.

# Internalize the following 
 /.agents/**


# Everything Claude Code (ECC) — Agent Instructions

This is a **production-ready AI coding plugin** providing 28 specialized agents, 116 skills, 59 commands, and automated hook workflows for software development.

**Version:** 1.9.0

## Core Principles

1. **Agent-First** — Delegate to specialized agents for domain tasks
2. **Test-Driven** — Write tests before implementation, 80%+ coverage required
3. **Security-First** — Never compromise on security; validate all inputs
4. **Immutability** — Always create new objects, never mutate existing ones
5. **Plan Before Execute** — Plan complex features before writing code

## Available Agents

| Agent                | Purpose                                  | When to Use                                 |
| -------------------- | ---------------------------------------- | ------------------------------------------- |
| planner              | Implementation planning                  | Complex features, refactoring               |
| architect            | System design and scalability            | Architectural decisions                     |
| tdd-guide            | Test-driven development                  | New features, bug fixes                     |
| code-reviewer        | Code quality and maintainability         | After writing/modifying code                |
| security-reviewer    | Vulnerability detection                  | Before commits, sensitive code              |
| build-error-resolver | Fix build/type errors                    | When build fails                            |
| e2e-runner           | End-to-end Playwright testing            | Critical user flows                         |
| refactor-cleaner     | Dead code cleanup                        | Code maintenance                            |
| doc-updater          | Documentation and codemaps               | Updating docs                               |
| docs-lookup          | Documentation and API reference research | Library/API documentation questions         |
| chief-of-staff       | Communication triage and drafts          | Multi-channel email, Slack, LINE, Messenger |
| loop-operator        | Autonomous loop execution                | Run loops safely, monitor stalls, intervene |
| harness-optimizer    | Harness config tuning                    | Reliability, cost, throughput               |
| typescript-reviewer  | TypeScript/JavaScript code review        | TypeScript/JavaScript projects              |

## Agent Orchestration

Use agents proactively without user prompt:

- Complex feature requests → **planner**
- Code just written/modified → **code-reviewer**
- Bug fix or new feature → **tdd-guide**
- Architectural decision → **architect**
- Security-sensitive code → **security-reviewer**
- Multi-channel communication triage → **chief-of-staff**
- Autonomous loops / loop monitoring → **loop-operator**
- Harness config reliability and cost → **harness-optimizer**

Use parallel execution for independent operations — launch multiple agents simultaneously.

## Security Guidelines

**Before ANY commit:**

- No hardcoded secrets (API keys, passwords, tokens)
- All user inputs validated
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized HTML)
- CSRF protection enabled
- Authentication/authorization verified
- Rate limiting on all endpoints
- Error messages don't leak sensitive data

**Secret management:** NEVER hardcode secrets. Use environment variables or a secret manager. Validate required secrets at startup. Rotate any exposed secrets immediately.

**If security issue found:** STOP → use security-reviewer agent → fix CRITICAL issues → rotate exposed secrets → review codebase for similar issues.

## Coding Style

**Immutability (CRITICAL):** Always create new objects, never mutate. Return new copies with changes applied.

**File organization:** Many small files over few large ones. 200-400 lines typical, 800 max. Organize by feature/domain, not by type. High cohesion, low coupling.

**Error handling:** Handle errors at every level. Provide user-friendly messages in UI code. Log detailed context server-side. Never silently swallow errors.

**Input validation:** Validate all user input at system boundaries. Use schema-based validation. Fail fast with clear messages. Never trust external data.

**Code quality checklist:**

- Functions small (<50 lines), files focused (<800 lines)
- No deep nesting (>4 levels)
- Proper error handling, no hardcoded values
- Readable, well-named identifiers

## Testing Requirements

**Minimum coverage: 80%**

Test types (all required):

1. **Unit tests** — Individual functions, utilities, components
2. **Integration tests** — API endpoints, database operations
3. **E2E tests** — Critical user flows

**TDD workflow (mandatory):**

1. Write test first (RED) — test should FAIL
2. Write minimal implementation (GREEN) — test should PASS
3. Refactor (IMPROVE) — verify coverage 80%+

Troubleshoot failures: check test isolation → verify mocks → fix implementation (not tests, unless tests are wrong).

## Development Workflow

1. **Plan** — Use planner agent, identify dependencies and risks, break into phases
2. **TDD** — Use tdd-guide agent, write tests first, implement, refactor
3. **Review** — Use code-reviewer agent immediately, address CRITICAL/HIGH issues
4. **Capture knowledge in the right place**
   - Personal debugging notes, preferences, and temporary context → auto memory
   - Team/project knowledge (architecture decisions, API changes, runbooks) → the project's existing docs structure
   - If the current task already produces the relevant docs or code comments, do not duplicate the same information elsewhere
   - If there is no obvious project doc location, ask before creating a new top-level file
5. **Commit** — Conventional commits format, comprehensive PR summaries

## Git Workflow

**Commit format:** `<type>: <description>` — Types: feat, fix, refactor, docs, test, chore, perf, ci

**PR workflow:** Analyze full commit history → draft comprehensive summary → include test plan → push with `-u` flag.

## Architecture Patterns

**API response format:** Consistent envelope with success indicator, data payload, error message, and pagination metadata.

**Repository pattern:** Encapsulate data access behind standard interface (findAll, findById, create, update, delete). Business logic depends on abstract interface, not storage mechanism.

**Skeleton projects:** Search for battle-tested templates, evaluate with parallel agents (security, extensibility, relevance), clone best match, iterate within proven structure.

## Performance

**Context management:** Avoid last 20% of context window for large refactoring and multi-file features. Lower-sensitivity tasks (single edits, docs, simple fixes) tolerate higher utilization.

**Build troubleshooting:** Use build-error-resolver agent → analyze errors → fix incrementally → verify after each fix.


## Success Metrics

- All tests pass with 80%+ coverage
- No security vulnerabilities
- Code is readable and maintainable
- Performance is acceptable
- User requirements are met

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