# 🪪 LICENSING MODULE — IMPLEMENTATION PLAN

This document defines the **strict licensing system contract**.
All agents MUST follow this specification.

---

# 🎯 OBJECTIVE

Control application usage with:
- Device-bound licensing
- Offline-first validation
- Expiration + grace handling
- Tamper-resistant verification

---

# 🧩 MODULE STRUCTURE

/src/renderer/src/License
  /components
  /hooks
  /store
  /services
  /types

/src/main/controllers/configration.controllers/isLicense


---

# SECURITY REQUIREMENTS (CRITICAL)

- License key MUST be encrypted at rest
- License MUST include a digital signature (RSA/ECDSA)
- NEVER trust client-side validation alone
- DeviceId MUST be derived from machine fingerprint
- License validation MUST happen in main process ONLY

---

# DEVICE BINDING

## Device Fingerprint Strategy

Combine:
- CPU ID
- Disk serial
- OS identifier

Then hash:

```ts
deviceId = aes-256-cbc (cpu + disk + os)
```

## Rules
- DeviceId must be consistent across restarts
- Must not be easily spoofable
- Do NOT expose raw fingerprint to renderer

## LICENSE STRUCTURE (DECODED)
{
  "licenseKey": "XXXX-XXXX",
  "type": "TRIAL" | "MONTHLY" | "QUARTERLY" | "YEARLY" ,
  "issuedAt": "date",
  "expirationDate": "date",
  "deviceId": "hashed",
  "signature": "signed_payload"
}

## SIGNATURE VALIDATION
- Use public/private key cryptography
- Public key stored in app
- Verify signature before trusting license
- If signature invalid → status = INVALID 

## LICENSING FLOW (STRICT)
1. APP START

Main process triggers:
→ licenseService.validate()

2. LOAD LICENSE
Read from local DB
Decrypt license key

If NOT FOUND:
→ status = NO_LICENSE

3. VALIDATION STEPS
- Step 1: Signature Check
  - Verify license signature
  - If invalid → INVALID
- Step 2: Device Match
  - Compare stored DeviceId vs current
  - If mismatch → INVALID
- Step 3: Expiration Check

- Cases:
- Valid
  - Now < ExpirationDate → ACTIVE
- Grace Period
  - Now > ExpirationDate BUT within GraceDays → GRACE
- Expired
  - Now > ExpirationDate + GraceDays → EXPIRED

4. RESULT

Return:
{
  status: "ACTIVE | GRACE | EXPIRED | INVALID | NO_LICENSE",
  expirationDate,
  remainingDays
}

5. RENDERER RESPONSE
ACTIVE → proceed normally
GRACE → allow usage + show warning
EXPIRED → restrict features
INVALID → block system
NO_LICENSE → show activation UI

## RESTRICTION RULES
- If INVALID or NO_LICENSE
    - Block ALL modules except licensing
    - Disable navigation
- If EXPIRED
    - Disable:
        - Transactions
        - Reports export
    - Allow:
        - Viewing data
- If GRACE
    - Allow full usage
    - Show persistent warning

## OFFLINE MODE
Rules
- System MUST work without internet
- Validation uses local license
- Optional online validation (if available)


## OPTIONAL ONLINE VALIDATION
- Trigger
  - On app start (if online)
  - Periodically (e.g. every 24h)
- Flow
  - Send licenseKey + deviceId
  - Validate with server
  - Update LastValidatedAt
- If server rejects:
  - mark INVALID

## EDGE CASES (MUST HANDLE)
  - System clock tampering
  - Corrupted license file
  - Device hardware change
  - Expired but within grace
  - Signature mismatch
  - Missing fields

## UI/UX REQUIREMENTS
- Clean, professional interface
- Clear status indicators
- Easy to understand messages
- No technical jargon
- Responsive design

## ANTI-TAMPER RULES
- Detect backward system clock changes
- Store last known timestamp
- If current < lastKnown → flag suspicious
- Optional:
  - Lock system if tampering detected

## ACTIVATION FLOW
Input
- License key (user input)

Steps
- Send to main process
- Decode + verify signature
- Bind to DeviceId
- Save encrypted license
- Validate immediately

## DEACTIVATION FLOW
Input
- License key

Steps
- Send to main process
- Remove license from DB
- Clear DeviceId binding
- Optional: Mark as deactivated on server

## RECOVERY FLOW
Scenario
- Device hardware failure
- Need to move license to new device

Steps
- User contacts support
- Support deactivates old device
- User activates on new device
- Optional: Server-side device limit


## SECURITY CHECKLIST
- [ ] License encrypted at rest
- [ ] Signature verification on every validation
- [ ] DeviceId binding implemented
- [ ] Main process handles all validation
- [ ] Renderer cannot access raw license
- [ ] Optional online validation
- [ ] Anti-tamper detection
- [ ] Grace period handling
- [ ] Restriction rules enforced
- [ ] Offline-first design
- [ ] Clear error messages
- [ ] Audit logging

## TESTING REQUIREMENTS
- Test valid license activation
- Test expired license
- Test invalid signature
- Test device mismatch
- Test offline validation
- Test online validation
- Test clock tampering
- Test grace period
- Test restrictions
- Test UI flows

## TEST CASES
Unit Tests
- Valid license
- Expired license
- Grace period logic
- Invalid signature
- Device mismatch
Security Tests
- Tampered license
- Modified expiration date
- Fake signature

## NOTES
- This is a strict licensing system
- No shortcuts
- No bypassing
- Professional implementation required
- Follow all security best practices

## IMPLEMENTATION STRATEGY

Agents MUST:

- Implement device fingerprint generator
- Implement license parser + validator
- Implement signature verification
- Implement expiration + grace logic
- Implement IPC layer
- Implement UI last

## PRINCIPLE

Licensing must be:

- Deterministic
- Tamper-resistant
- Offline-capable
- Fail-safe (default = INVALID)