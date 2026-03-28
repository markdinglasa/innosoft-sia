# AUTHENTICATION - USER STORIES

## Key Architectural Decisions
- Main-Process Authority: No password verification or session creation logic should exist in the Renderer. The IPC boundary is the "Security Perimeter."
- Brute-Force Shield: Mandatory 5-attempt threshold with a 15-minute lockout to prevent automated attacks on the local database.
- Permission Flattening: Converting nested Role -> Permission relationships into a single list (e.g., ['item.create', 'item.delete']) to make frontend authorization checks (O(n)) highly efficient.

## Potential Risks & Mitigation
- Credential Enumeration: Attackers determining valid usernames based on error messages. Mitigation: Always return the same generic error message ("Invalid username or password") regardless of which part of the check failed.
- Plaintext Leakage: Accidentally logging passwords in IPC or Main process logs. Mitigation: Implement a log sanitizer that explicitly scrubs password and oldPassword fields from all console/file logs.
- Session Hijacking: Stealing an encrypted session file. Mitigation: Bind the session token to the Machine Fingerprint (CPU/Disk Hash) in the Main process logic. If the fingerprints don't match, the session is rejected.

## Developer Checklist
- Implement bcrypt comparison in AuthService.
- Create AuthGuard HOC/Component for React Router protection.
- Sanitize all Auth IPC payloads in logs.
- Implement checkPermission(permission: string) in the Renderer Auth Store.

```
{
  "epics": [
    {
      "id": "EPIC-AUT-001",
      "title": "Secure Credential Engine (Main Process)",
      "description": "Develop the backend logic for password hashing, verification, and brute-force protection.",
      "features": ["FEAT-AUT-001", "FEAT-AUT-002"]
    },
    {
      "id": "EPIC-AUT-002",
      "title": "Session & Permission Lifecycle",
      "description": "Manage encrypted session tokens and the flattening of hierarchical user permissions.",
      "features": ["FEAT-AUT-003", "FEAT-AUT-004"]
    },
    {
      "id": "EPIC-AUT-003",
      "title": "Authentication UI & Access Control",
      "description": "Create the login interface and the reactivity hooks for protecting UI routes and components.",
      "features": ["FEAT-AUT-005", "FEAT-AUT-006"]
    }
  ],
  "features": [
    {
      "id": "FEAT-AUT-001",
      "epic_id": "EPIC-AUT-001",
      "title": "Bcrypt Credential Verification",
      "description": "Secure password comparison using industry-standard hashing.",
      "user_stories": [
        {
          "title": "Verify Hashed Passwords",
          "story": "As a system, I want to compare user-provided credentials against hashed values in the DB so that I never store or handle plaintext passwords.",
          "acceptance_criteria": [
            "Given a login request, When processing, Then the system MUST use bcrypt.compare() to verify the password.",
            "Given an incorrect password, When verified, Then the system must return a generic 'Invalid Credentials' error.",
            "Given a successful match, When the user is marked 'InActive', Then the login must be rejected."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": ["Existing users in the DB already have bcrypt-hashed passwords."],
      "open_questions": []
    },
    {
      "id": "FEAT-AUT-002",
      "epic_id": "EPIC-AUT-001",
      "title": "Brute-Force Protection",
      "description": "Automatically lock accounts after repeated failures.",
      "user_stories": [
        {
          "title": "Lock Account after Failed Attempts",
          "story": "As a system, I want to track failed login attempts so that I can prevent brute-force attacks on user accounts.",
          "acceptance_criteria": [
            "Given 5 consecutive failed login attempts, When the next attempt is made, Then the account MUST be locked for 15 minutes.",
            "Given a locked account, When an attempt is made within the lockout window, Then the system must return a 'Temporarily Locked' message with the remaining time.",
            "Given a successful login before reaching the threshold, When verified, Then the 'FailedAttempts' counter must reset to zero."
          ],
          "priority": "High"
        }
      ],
      "assumptions": [],
      "open_questions": ["Should the admin be able to manually unlock an account?"]
    },
    {
      "id": "FEAT-AUT-003",
      "epic_id": "EPIC-AUT-002",
      "title": "Encrypted Session Persistence",
      "description": "Securely store and restore user sessions across app restarts.",
      "user_stories": [
        {
          "title": "Auto-Restore Session on App Start",
          "story": "As a user, I want the app to remember my login session so that I don't have to re-enter my credentials every time I open the app.",
          "acceptance_criteria": [
            "Given a valid session exists in storage, When the app starts, Then it must decrypt and restore the session state.",
            "Given an expired session (over 8 hours), When the app starts, Then the session must be cleared and the user redirected to login.",
            "Given a session cloned from another machine, When restored, Then the hardware fingerprint check must fail and invalidate the session (Security Enhancement)."
          ],
          "priority": "High"
        }
      ],
      "assumptions": ["Session encryption uses a machine-specific key to prevent token portable hijacking."],
      "open_questions": []
    },
    {
      "id": "FEAT-AUT-004",
      "epic_id": "EPIC-AUT-002",
      "title": "Permission Flattening Service",
      "description": "Translate complex RBAC roles into simple permission arrays.",
      "user_stories": [
        {
          "title": "Generate Unified Permission List",
          "story": "As a system, I want to collect all permissions associated with a user's role into a single array so that the UI can easily check access rights.",
          "acceptance_criteria": [
            "Given a user with a 'Manager' role, When logging in, Then the session must contain a flat list of strings representing all manager rights.",
            "Given a change in role permissions, When the user next logs in, Then their permission array must reflect the latest DB state.",
            "Given a request for an unauthorized module, When checked via 'canAccess', Then it must return FALSE."
          ],
          "priority": "Medium"
        }
      ],
      "assumptions": [],
      "open_questions": []
    },
    {
      "id": "FEAT-AUT-006",
      "epic_id": "EPIC-AUT-003",
      "title": "Authorization UI Hooks",
      "description": "Reactive components and hooks for protecting the frontend.",
      "user_stories": [
        {
          "title": "Protect Components via Permissions",
          "story": "As a developer, I want a simple hook to check if the current user has access to a feature so that I can hide or disable unauthorized UI elements.",
          "acceptance_criteria": [
            "Given a 'Delete' button, When the user lacks 'item.delete' permission, Then the button must be hidden or disabled.",
            "Given an unauthorized URL route, When the user attempts to navigate to it, Then the app must redirect back to the dashboard or an 'Access Denied' page.",
            "Given a session logout, When triggered, Then the auth store must be cleared and all reactive components must reset to an unauthenticated state."
          ],
          "priority": "High"
        }
      ],
      "assumptions": [],
      "open_questions": []
    }
  ]
}

```