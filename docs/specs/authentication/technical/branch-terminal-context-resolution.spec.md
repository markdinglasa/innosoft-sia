
# TECH SPEC — Branch and Terminal Context Resolution

## 1. Spec ID
TECH-AUTH-005

## 2. Objective
Resolve valid branch and terminal operational context before protected operational workflows begin.

## 3. Covered Context
- branch access list
- active branch
- terminal binding
- terminal validity for branch

## 4. Resolution Policy
### Branch
If user has:
- one valid branch access → auto-select branch
- multiple valid branch access → require selection or use remembered safe context if allowed

### Terminal
If system is terminal-bound:
- validate active terminal exists
- validate terminal belongs to active branch
- validate terminal is active

## 5. Required Rules
- no transaction session without valid branch
- no terminal-bound transaction session without valid terminal
- invalid pairings must block operational access

## 6. Error Codes
```ts
type BranchTerminalContextErrorCode =
  | "NO_BRANCH_ACCESS"
  | "MULTIPLE_BRANCH_SELECTION_REQUIRED"
  | "TERMINAL_REQUIRED"
  | "TERMINAL_INVALID"
  | "TERMINAL_BRANCH_MISMATCH";
```

## 7. Acceptance Criteria
- valid branch/terminal context is resolved before transaction entry
- invalid context blocks entry safely

## 8. Agent Restrictions
- DO NOT silently default to arbitrary branch or terminal