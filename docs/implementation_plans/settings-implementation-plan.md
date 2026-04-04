# ⚙️ SETTINGS MODULE — IMPLEMENTATION PLAN

This document defines the **system configuration contract**.
All agents MUST follow this specification.

---

# 🎯 OBJECTIVE

Provide a secure, structured, and real-time configuration system for:
- Terminal-specific settings
- Branch-level configurations
- POS behavior control (tax, receipt, printing)

---

# 🧩 MODULE STRUCTURE

/src/renderer/src/POS/features/sys-settings
  /components
  /hooks
  /store
  /services
  /types
  /validators

/src/main/services/utility.services/sys-settings.service
/src/main/services/utility.services/user-terminal.service

/src/main/controllers/utility.controllers/sys-settings.controller
/src/main/controllers/utility.controllers/user-terminal.controller

---

# 🧱 CONFIGURATION SCOPE (CRITICAL)

## 1. GLOBAL (System-wide)
- Rarely used
- Example: app version flags

## 2. BRANCH-LEVEL
- Taxes
- Default currency
- Business rules

## 3. TERMINAL-LEVEL (MOST IMPORTANT)
- Active terminal
- Printer configuration
- Receipt layout
- UI preferences

---

# 🧩 DATA MODEL (MSSQL)

## SysUserTerminal
- Id
- TerminalId
- UserId
- IsActive

---

## SysSettings (Generic Key-Value Table)

---

# 🧠 SETTINGS STRUCTURE (STANDARDIZED KEYS)

## TERMINAL SETTINGS

### app.preferences
```json
{
  "theme": "light",
  "autoLock": true,
  "timeoutMinutes": 15
}
```

## SECURITY REQUIREMENTS (CRITICAL)
- Settings MUST NOT expose sensitive data (e.g. credentials)
- All updates MUST go through validation layer
- Renderer MUST NOT directly modify DB
- Only main process persists settings


## SETTINGS FLOW (STRICT)
1. LOAD SETTINGS (APP START)
Fetch GLOBAL
Fetch BRANCH
Fetch TERMINAL
Merge (priority: TERMINAL > BRANCH > GLOBAL)
2. UPDATE SETTING
Flow:

Update Request (Renderer)
→ Validate (Renderer + Main)
→ IPC Call
→ Persist in DB
→ Update in-memory cache
→ Notify subscribers
→ Apply immediately

## SETTINGS MERGE STRATEGY

Priority:

TERMINAL overrides BRANCH
BRANCH overrides GLOBAL

```json

finalSettings = {
  ...global,
  ...branch,
  ...terminal
}
```

## ACTIVE TERMINAL FLOW
- On App Start
- Load available terminals (MstTerminal)
- Check saved active terminal
- If none:
    - Prompt user selection
    - Store ActiveTerminalId locally

## RULES
- Only ONE active terminal per app instance
- Terminal must belong to selected branch


## APPLY SETTINGS (REAL-TIME)

When settings change:

Update store immediately
Trigger side effects:
    - Theme change
    - Auto-lock timer restart
    - Printer config reload
    - Receipt layout update

## CACHING STRATEGY
- In Main Process
    - Cache all settings in memory
    - Refresh on update
- In Renderer
    - Store merged settings in global store 

## EDGE CASES (MUST HANDLE)
- Missing terminal
- Invalid JSON config
- Conflicting settings
- Partial updates
- Corrupted stored settings

## TEST CASES (MANDATORY)
- Unit Tests
    - Settings merge logic
    - Update + persistence
    - Validation failures
- Integration Tests
    - Apply settings in runtime
    - Printer reinitialization
    - Tax update affecting transactions

## PERFORMANCE REQUIREMENTS
- Settings load < 100ms
- Updates reflect instantly
- Cached access only (no repeated DB calls) 

## AGENT RESTRICTIONS
- DO NOT hardcode settings
- DO NOT bypass validation
- DO NOT write directly to DB from renderer
- DO NOT duplicate config logic


## FAILURE BEHAVIOR

If:
    - Invalid setting → reject update
    - Missing scope → fallback to lower scope
    - Corrupt data → reset to default

## IMPLEMENTATION STRATEGY

Agents MUST:

    - Implement settings schema + validation
    - Implement merge logic
    - Implement caching layer
    - Implement IPC handlers
    - Implement renderer store
    - Implement UI last

## PRINCIPLE

Settings must be:

    - Predictable
    - Layered (global → branch → terminal)
    - Immediately applied
    - Strictly validated