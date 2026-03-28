
## LICENSING USER-STORIES
# Potential Risks & Mitigation
 - Hardware Changes: Users upgrading their SSD or CPU will break the deviceId. 
 - Mitigation: Implement a "Request Recovery" flow in the UI that directs users to support for a license reset.
 - Renderer Bypass: A savvy user could use React DevTools to change the local state to ACTIVE. Mitigation: Ensure that even if the UI is bypassed, the Services/IPC layer in the Main process performs a secondary check before executing sensitive actions (like saving a transaction). 
 - Clock Battery Failure: Old CMOS batteries can cause the clock to reset to 1970
 - Mitigation: Add a check that if the date is obviously wrong (e.g., before 2024), prompt the user to update their system time rather than immediately banning them.

# Test Cases for Developers
 - Red Path: Manually edit the expirationDate in the database and verify that the app status changes to EXPIRED on next boot.
 - Red Path: Copy the database file to another machine and verify it shows INVALID (Device Mismatch).
 - Green Path: Perform full activation and verify Transactions module becomes clickable immediately without restart.

```
{
  "epics": [
    {
      "id": "EPIC-LIC-001",
      "title": "Core Licensing Engine (Main Process)",
      "description": "Establish the secure foundation for license validation, hardware binding, and status calculation in the Electron main process.",
      "features": ["FEAT-LIC-001", "FEAT-LIC-002", "FEAT-LIC-003"]
    },
    {
      "id": "EPIC-LIC-002",
      "title": "Activation & Deactivation Workflows",
      "description": "Handle the lifecycle of a license from initial user entry to removal and device unbinding.",
      "features": ["FEAT-LIC-004", "FEAT-LIC-005"]
    },
    {
      "id": "EPIC-LIC-003",
      "title": "Renderer Enforcement & UX",
      "description": "Expose license status to the UI and enforce feature-level restrictions based on the main process state.",
      "features": ["FEAT-LIC-006", "FEAT-LIC-007", "FEAT-LIC-008"]
    }
  ],
  "features": [
    {
      "id": "FEAT-LIC-001",
      "epic_id": "EPIC-LIC-001",
      "title": "Device Fingerprinting & Binding",
      "description": "Generate a unique hash based on machine hardware to prevent license sharing.",
      "user_stories": [
        {
          "title": "Generate Machine Fingerprint",
          "story": "As a system, I want to generate a unique ID using CPU, Disk, and OS identifiers so that I can bind a license to a specific device.",
          "acceptance_criteria": [
            "Given the app is running on a machine, When the fingerprint service is called, Then it must return a consistently reproducible hash (AES-256-CBC) of CPU + Disk ID + OS.",
            "Given the device fingerprint is generated, When the machine is restarted, Then the ID must remain identical.",
            "Given the fingerprint is generated in the main process, When requested by the renderer, Then the raw hardware details must NEVER be exposed."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": ["Hardware IDs (CPU/Disk) are accessible via Node.js native modules or OS commands in Electron Main."],
      "open_questions": ["How do we handle virtual machines or containers where hardware IDs might be generic?"]
    },
    {
      "id": "FEAT-LIC-002",
      "epic_id": "EPIC-LIC-001",
      "title": "Digital Signature Verification",
      "description": "Cryptographically verify license authenticity.",
      "user_stories": [
        {
          "title": "Verify RSA/ECDSA Signature",
          "story": "As a system, I want to verify the digital signature of a license payload using a public key so that I can prevent tampered licenses from being accepted.",
          "acceptance_criteria": [
            "Given a license JSON object, When the validation service runs, Then it must verify the 'signature' field against the payload using the embedded public key.",
            "Given a license with a modified expiration date, When signature verification runs, Then it must return INVALID status.",
            "Given a license with an invalid signature, When the app starts, Then it must block all core modules."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": ["Public key is securely embedded in the application binary during build."],
      "open_questions": []
    },
    {
      "id": "FEAT-LIC-003",
      "epic_id": "EPIC-LIC-001",
      "title": "Status Matrix & Grace Handling",
      "description": "Calculate the granular state of the license.",
      "user_stories": [
        {
          "title": "Calculate License State Machine",
          "story": "As a system, I want to determine if the license is ACTIVE, GRACE, EXPIRED, or INVALID so that I can inform the renderer of available capabilities.",
          "acceptance_criteria": [
            "Given the current date is before 'expirationDate', When validated, Then status must be 'ACTIVE'.",
            "Given the current date is after 'expirationDate' but within 'GraceDays', When validated, Then status must be 'GRACE'.",
            "Given the current date is after 'expirationDate' + 'GraceDays', When validated, Then status must be 'EXPIRED'.",
            "Given 'deviceId' in license does not match machine fingerprint, When validated, Then status must be 'INVALID'."
          ],
          "priority": "High"
        }
      ],
      "assumptions": ["Grace period duration is defined within the license payload or as a global config."],
      "open_questions": []
    },
    {
      "id": "FEAT-LIC-004",
      "epic_id": "EPIC-LIC-002",
      "title": "License Activation Workflow",
      "description": "Process user input and bind license to device.",
      "user_stories": [
        {
          "title": "Secure Activation Process",
          "story": "As a user, I want to input a license key so that I can unlock the full features of the application.",
          "acceptance_criteria": [
            "Given the user enters a key, When they click Activate, Then the Main process must decrypt, verify signature, and bind the current DeviceId.",
            "Given a successful activation, When complete, Then the license must be saved encrypted in the local database.",
            "Given an invalid key, When activation is attempted, Then a clear non-technical error message must be shown."
          ],
          "priority": "High"
        }
      ],
      "assumptions": [],
      "open_questions": ["Should we support offline activation (manual challenge/response) or only internet-based initial activation?"]
    },
    {
      "id": "FEAT-LIC-006",
      "epic_id": "EPIC-LIC-003",
      "title": "Renderer Feature Enforcement",
      "description": "Block or restrict UI modules based on license state.",
      "user_stories": [
        {
          "title": "Restrict Modules by Status",
          "story": "As a system, I want to disable navigation and specific features based on license status so that I can enforce the licensing contract.",
          "acceptance_criteria": [
            "Given status is 'NO_LICENSE' or 'INVALID', When the user interacts with the app, Then all modules except Licensing must be unreachable.",
            "Given status is 'EXPIRED', When the user views the app, Then 'Transactions' and 'Export' buttons must be disabled, but data viewing remains active.",
            "Given status is 'GRACE', When the user is in any screen, Then a persistent, non-intrusive warning banner must be visible.",
            "Given a sensitive action (Transaction/Export) is triggered from the Renderer, When the IPC layer receives the request, Then the Main Process MUST perform a secondary license status check before processing the request."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": ["Navigation is controlled via a centralized Guard or Hook linked to the Licensing Store."],
      "open_questions": []
    },
    {
      "id": "FEAT-LIC-007",
      "epic_id": "EPIC-LIC-001",
      "title": "Anti-Tamper: Clock Protection",
      "description": "Detect attempts to bypass expiration via system clock changes.",
      "user_stories": [
        {
          "title": "Detect Backward System Clock",
          "story": "As a system, I want to store the last known successful validation timestamp so that I can detect if the user has moved the system clock backwards.",
          "acceptance_criteria": [
            "Given the app is closing or validating, When it runs, Then it must store the current timestamp as 'lastKnownTime' in encrypted storage.",
            "Given the app starts, When 'currentTime' is significantly earlier than 'lastKnownTime', Then it must flag the license as 'INVALID_TAMPERED'.",
            "Given a system clock reset (e.g., CMOS battery failure to 1970/1980), When the app starts, Then it must prompt the user to update their system time instead of immediately flagging as tampered.",
            "Given a detected tampering or invalid date, When the user fixes the clock, Then the system should allow re-validation."
          ],
          "priority": "Medium"
        }
      ],
      "assumptions": ["A small drift (e.g., < 5 mins) is ignored to avoid false positives on timezone updates."],
      "open_questions": []
    },
    {
      "id": "FEAT-LIC-008",
      "epic_id": "EPIC-LIC-003",
      "title": "License Recovery Flow",
      "description": "Provide a mechanism for users to restore access after legitimate hardware changes.",
      "user_stories": [
        {
          "title": "Request License Recovery",
          "story": "As a user, I want to request a license reset after a hardware upgrade so that I can re-activate the software on my new machine configuration.",
          "acceptance_criteria": [
            "Given a 'Device Mismatch' error, When the user is on the Licensing screen, Then an option to 'Request Recovery' must be clearly visible.",
            "Given recovery is requested, When the user clicks the option, Then it must provide a human-readable 8-digit 'Support Code' and a technical 'Device Signature' to be sent to support.",
            "Given a valid recovery token from support, When entered, Then the system MUST unbind the old machine ID and re-bind the license to the current hardware profile."
          ],
          "priority": "Medium"
        }
      ],
      "assumptions": ["Initial recovery requires manual verification by support to prevent abuse."],
      "open_questions": ["Should we automate recovery if the user logs into an online account?"]
    }
  ]
}
```