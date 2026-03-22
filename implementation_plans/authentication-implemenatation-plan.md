# 🔐 AUTHENTICATION MODULE — IMPLEMENTATION PLAN

This document defines the **strict implementation contract** for authentication.
All agents MUST follow this specification.

---

# 🎯 OBJECTIVE

Provide a secure, offline-first authentication system with:
- Local-first login
- Role + permission-based authorization
- Secure session handling
- Optional online/license validation

---

# 🧩 MODULE STRUCTURE

/src/renderer/src/features/authentication
  /components
  /hooks
  /store
  /api
  /types
  /utils

/src/main/controllers/auth.controllers
/src/main/services/auth.services

---

# 🔐 SECURITY REQUIREMENTS (CRITICAL)

- Passwords MUST be hashed using bcrypt
- NEVER store plaintext passwords
- Compare using bcrypt.compare
- Lock account after X failed attempts (default: 5)
- Lock duration configurable (default: 15 mins)
- Session tokens MUST be encrypted before storage
- DO NOT expose sensitive data to renderer

---

# 🔁 AUTHENTICATION FLOW (STRICT)

## 1. LOGIN REQUEST (Renderer → IPC)

Input:
{
  username: string,
  password: string
  loginDate: string | Date
}

---

## 2. VALIDATION (Main Process ONLY)

Steps:
1. Fetch user by username
2. If NOT found → return generic error
3. Check IsActive
4. Check LockedUntil
5. Compare password (bcrypt)

---

## 3. FAILED LOGIN HANDLING

If password invalid:
- Increment FailedAttempts
- If threshold reached:
  → Set LockedUntil = now + duration
- Return error (DO NOT reveal which field failed)

---

## 4. SUCCESS LOGIN

- Reset FailedAttempts = 0
- Update LastLoginAt
- Generate session object

---

## 5. SESSION CREATION

Session Structure:
{
  userId,
  username,
  role,
  permissions: string[],
  issuedAt,
  expiresAt,
  loginDate
}

---

## 6. SESSION STORAGE

- In-memory (primary)
- Encrypted local storage (fallback)

Storage key: `auth_session`

---

## 7. LOAD PERMISSIONS

Query:
- Role → RolePermissions → Permissions

Flatten to:
["transaction.create", "reports.view"]

---

## 8. RESPONSE TO RENDERER

Return:
{
  success: true,
  user: { id, username, role },
  permissions: string[]
}

---

## 9. REDIRECTION

- Based on role or last route
- Store session in global auth store

---

# 🧠 SESSION MANAGEMENT

## Expiration
- Default: 8 hours
- Auto logout when expired

## Auto Restore
On app start:
1. Load encrypted session
2. Validate expiration
3. Restore if valid

---

# 🔐 AUTHORIZATION SYSTEM

## Core Utility

```ts
canAccess(permission: string): boolean
```

# EDGE CASES (MUST HANDLE)
- Invalid username/password
- Locked account
- Expired session
- Corrupted local session
- Missing permissions
- Inactive user

# IMPLEMENTATION STRATEGY

Agents MUST:

1. Implement backend (main process) first
2. Then IPC handlers
3. Then renderer hooks/store
4. Then UI components

# PRINCIPLE

Authentication logic MUST be:

- Centralized
- Predictable
- Non-duplicated
- Secure by default