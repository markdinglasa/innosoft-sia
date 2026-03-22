# 🔗 DATABASE LINKING MODULE — IMPLEMENTATION PLAN

This document defines the **strict database connection and multi-tenant system contract**.
All agents MUST follow this specification.

---

# 🎯 OBJECTIVE

Provide a secure, dynamic, and scalable database connection system with:
- Runtime-configurable MSSQL connections
- Multi-tenant support
- Connection pooling
- Offline-first fallback
- Optional central sync capability

---

# 🧩 MODULE STRUCTURE

/src/renderer/src/POS/features/database-link
  /components
  /hooks
  /store
  /types

/src/main/controllers/configuration.controllers/setConnection


---

# 🧱 DATA MODEL (LOCAL STORAGE / SQLITE OR FILE)

## DbConnections Table

- Id
- Name (e.g. "Branch A")
- Host
- Port
- Database
- Username (encrypted)
- Password (encrypted)
- IsActive (boolean)
- LastConnectedAt
- Status (CONNECTED | DISCONNECTED | ERROR)

---

# 🔐 SECURITY REQUIREMENTS (CRITICAL)

- DB credentials MUST be encrypted at rest
- Credentials MUST NEVER be exposed to renderer
- ONLY main process can access DB credentials
- DO NOT log credentials (even in errors)
- Use secure IPC communication only

---

# 🔁 CONNECTION FLOW (STRICT)

## 1. USER INPUT (Renderer)

Input:
{
  host,
  port,
  database,
  username,
  password
}

---

## 2. SEND TO MAIN (via IPC)

Renderer → Preload → Main

---

## 3. VALIDATION (MAIN PROCESS)

Steps:
1. Validate input format
2. Attempt connection using temp pool
3. Timeout after X seconds (default: 5s)

---

## 4. TEST CONNECTION RESULT

### SUCCESS
- Return success to renderer

### FAILURE
- Return sanitized error message
- DO NOT expose raw DB error

---

## 5. SAVE CONFIGURATION

- Encrypt username + password
- Store in local DB
- Mark as inactive by default

---

## 6. ACTIVATE CONNECTION

When selected:
- Decrypt credentials
- Initialize connection pool
- Set IsActive = true
- Deactivate others (single active tenant mode)

---

# ⚙️ CONNECTION POOLING

## Rules

- Use a SINGLE active pool per tenant
- Pool must be reused (no re-creation per query)
- Close pool before switching connection

---

## Example

```ts id="xw1g4m"
let activePool: ConnectionPool | null = null;

async function connect(config) {
  if (activePool) await activePool.close();
  activePool = await new sql.ConnectionPool(config).connect();
}
```

## MULTI-TENANT STRATEGY
- Mode: Single Active Tenant (Recommended)
    - Multiple DB configs stored
    - Only ONE active at runtime
- Switching Tenant Flow
    - Select tenant
    - Close current pool
    - Open new pool
    - Reload app state

## QUERY FLOW
Renderer → Service → IPC → Main DB Service → Query → Return

## Critical Rules
- Renderer MUST NEVER execute SQL directly
- Main process MUST validate all queries
- No direct DB access from renderer

## OFFLINE-FIRST DESIGN
- System MUST work without internet
- Local DB is primary source of truth
- Online sync is optional enhancement

## SYNC CAPABILITY (OPTIONAL)
- Sync with central database
- Sync on app start (if online)
- Sync on demand (user action)
- Sync conflicts resolved by:
    - Last write wins
    - User confirmation

## ERROR HANDLING
- Graceful error messages
- No raw DB errors exposed
- Retry logic for transient errors
- User-friendly guidance

## FAIL-SAFE RULES
- If connection fails:
    - DO NOT crash app
    - Return controlled error
- Always close unused pools
- Prevent memory leaks

## FAILURE BEHAVIOR 
- If:
    - Connection fails → mark DISCONNECTED
    - Pool fails → reinitialize once
    - Still fails → stop and report error

## SECURITY CHECKLIST
- [ ] DB credentials encrypted at rest
- [ ] No credentials in logs
- [ ] Renderer cannot access DB
- [ ] Secure IPC communication
- [ ] Connection pooling implemented
- [ ] Single active tenant mode
- [ ] Offline-first design
- [ ] Graceful error handling
- [ ] Optional sync capability
- [ ] Input validation
- [ ] Query validation

## TESTING REQUIREMENTS
- Test valid connection
- Test invalid connection
- Test connection timeout
- Test multi-tenant switching
- Test query execution
- Test offline mode
- Test sync functionality
- Test error handling
- Test security boundaries

## NOTES
- This is a strict database connection system
- No shortcuts
- No bypassing
- Professional implementation required
- Follow all security best practices

## AGENT RESTRICTIONS
- DO NOT store plaintext credentials
- DO NOT expose DB config to renderer
- DO NOT create new pool per query
- DO NOT bypass IPC layer

## IMPLEMENTATION STRATEGY

Agents MUST:

- Implement DB connection service
- Implement IPC layer for DB operations
- Implement encryption for credentials
- Implement connection pooling
- Implement multi-tenant logic
- Implement offline-first design
- Implement error handling
- Implement sync capability (optional)

## PRINCIPLE

Database connectivity must be:

- Secure
- Reliable
- Scalable
- Offline-capable
- Multi-tenant ready