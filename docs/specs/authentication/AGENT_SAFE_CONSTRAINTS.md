# AUTHENTICATION MODULE — AGENT SAFE CONSTRAINTS

## 1. Do Not Put Auth Logic in React
Agents must NOT implement authentication validation directly inside renderer pages/components.

Bad:
- password hash comparison in React
- DB login query inside renderer
- role-based trust only in frontend

---

## 2. Do Not Store Plaintext Credentials
Agents must NEVER:
- persist plaintext passwords
- log passwords
- expose hashes to renderer
- keep raw credentials in reusable session state

---

## 3. Do Not Merge UserType and Role
Agents must NEVER treat:
- UserType
- Role
- Permission

as interchangeable concepts.

Correct:
- UserType = workspace identity
- Role = permission bundle
- Permission = actionable access right

---

## 4. Do Not Trust Hidden Buttons as Security
Agents must NOT assume:
“the button is hidden, so it is secure.”

All sensitive actions must still fail safely if invoked indirectly.

---

## 5. Do Not Default to Broad Access
If auth context is incomplete:
- deny
- block
- require resolution

Never silently grant broad access because setup data is missing.

---

## 6. Do Not Silently Pick Arbitrary Branch or Terminal
If multiple branches or invalid terminal context exists, agents must not auto-guess unsafe operational context.

---

## 7. Do Not Implement Persistent Override Elevation
Manager approvals must NOT mutate the operator’s session into a permanently elevated session.

---

## 8. Do Not Scatter Authorization Logic
Agents must avoid hardcoding checks across random screens.

Prefer centralized:
- `canAccess(...)`
- route metadata
- action guards
- service-level authorization

---

## 9. Do Not Trust Restored Session Blindly
Restored session state must be integrity-checked before reuse.

---

## 10. Do Not Skip IPC Validation
All authentication and authorization IPC inputs must be schema-validated before business logic runs.