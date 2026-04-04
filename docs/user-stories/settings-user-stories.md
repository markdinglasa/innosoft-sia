# SETTINGS - USER STORIES

## Developer Checklist
- **Merge Logic Constants**: Use explicit constants for priority (0=Global, 1=Branch, 2=Terminal).
- **Reactive Updates**: Implement standard `onSettingsChange` IPC listener to trigger UI/Hardware side-effects.
- **Hardware Re-init**: Ensure all services (Printers, Scanners) have a `reinitialize()` method called by settings side-effects.

## Potential Risks & Mitigation
- **Settings Corruption**: Invalid/Malformed JSON in DB preventing app boot.
- **Mitigation**: Implement Zod schema validation on READ/WRITE. If DB data is corrupted, fallback to hardcoded defaults and log a critical error.
- **Initialization Race Condition**: UI rendering or hooks firing before IPC settings merge is complete.
- **Mitigation**: Wrap the main application in a `SettingsProvider` or `Guard` that displays a 'Connecting' state until settings are loaded.
- **Terminal Spoofing**: A terminal attempting to pull configuration for another branch.
- **Mitigation**: Store the machine fingerprint in the DB and validate against the current session fingerprint in the Main process before returning settings.

```
{
  "epics": [
    {
      "id": "EPIC-SET-001",
      "title": "Hierarchical Settings Engine (Main Process)",
      "description": "Establish the backend logic for merging global, branch, and terminal settings with strict validation.",
      "features": ["FEAT-SET-001", "FEAT-SET-002"]
    },
    {
      "id": "EPIC-SET-002",
      "title": "Terminal Identity & Activation",
      "description": "Manage how a physical machine identifies itself and selects its active configuration.",
      "features": ["FEAT-SET-003"]
    },
    {
      "id": "EPIC-SET-003",
      "title": "Reactive Settings UX (Renderer)",
      "description": "Implement the UI and state management to apply settings changes in real-time without restarts.",
      "features": ["FEAT-SET-004", "FEAT-SET-005"]
    }
  ],
  "features": [
    {
      "id": "FEAT-SET-001",
      "epic_id": "EPIC-SET-001",
      "title": "Layered Merge Service",
      "description": "Logic to combine multiple settings sources into a single state.",
      "user_stories": [
        {
          "title": "Merge Settings by Priority",
          "story": "As a system, I want to combine settings from Global, Branch, and Terminal levels so that terminal-specific overrides are applied correctly.",
          "acceptance_criteria": [
            "Given a Branch setting for 'Currency=USD' and a Terminal override for 'Currency=EUR', When settings are merged, Then the final value must be 'EUR'.",
            "Given a missing Terminal setting, When merging, Then the system must fallback to the Branch-level value.",
            "Given no settings are found at any level, When loading, Then the system must apply hardcoded defaults.",
            "Given a 'Settings Load' request, When app starts, Then the Renderer MUST block the primary UI and show a loading state until the IPC response is received (Race Condition Mitigation)."
          ],
          "priority": "Critical"
        }
      ],
      "assumptions": ["Settings are stored in a key-value or JSON format in the database."],
      "open_questions": []
    },
    {
      "id": "FEAT-SET-002",
      "epic_id": "EPIC-SET-001",
      "title": "Schema-Based Validation",
      "description": "Ensure settings data is valid and secure before persistence.",
      "user_stories": [
        {
          "title": "Validate Setting Type and Range",
          "story": "As a system, I want to validate every setting update against a strict schema so that I can prevent corrupt configuration from crashing the app.",
          "acceptance_criteria": [
            "Given a numeric setting update (e.g., 'timeoutMinutes'), When a string value is passed, Then the update must be rejected.",
            "Given a setting update for a sensitive key (e.g., 'dbPassword'), When attempted via the standard settings API, Then it must be blocked.",
            "Given a corrupted JSON string in the DB, When loading, Then the system must log an error and use the default value."
          ],
          "priority": "High"
        }
      ],
      "assumptions": ["Valdiation is performed using Zod or a similar schema library in the Main process."],
      "open_questions": []
    },
    {
      "id": "FEAT-SET-003",
      "epic_id": "EPIC-SET-002",
      "title": "Active Terminal Selection",
      "description": "Assign the current app instance to a physical terminal record.",
      "user_stories": [
        {
          "title": "Select Terminal on First Launch",
          "story": "As a user, I want to select my terminal from a list on first launch so that the app knows which printer and receipt layout to use.",
          "acceptance_criteria": [
            "Given the app starts and no Terminal ID is saved locally, When prompted, Then a list of available terminals for the selected branch must be displayed.",
            "Given a terminal selection request, When the selection is made, Then the Main process MUST verify the machine fingerprint against the DB to prevent unauthorized branch hardware moves.",
            "Given a terminal is already in use by another active instance, When selected, Then the system must warn the user.",
            "Given a successful terminal selection, When the app restarts, Then it must automatically load that terminal's settings without prompting."
          ],
          "priority": "High"
        }
      ],
      "assumptions": [],
      "open_questions": ["Should we support 'Ghost Terminals' for remote reporting that don't bind to a physical ID?"]
    },
    {
      "id": "FEAT-SET-004",
      "epic_id": "EPIC-SET-003",
      "title": "Real-time Side Effect Engine",
      "description": "Trigger app behavior changes immediately upon settings update.",
      "user_stories": [
        {
          "title": "Apply Dynamic Theme and Timer",
          "story": "As a user, I want my theme and auto-lock preferences to update instantly so that I don't have to restart the app to see changes.",
          "acceptance_criteria": [
            "Given a theme change from 'Light' to 'Dark', When saved, Then the UI must transition colors immediately.",
            "Given an update to 'autoLockTimeout', When saved, Then the current activity timer must restart with the new duration.",
            "Given a change in receipt header text, When a test print is triggered, Then the new text must be printed immediately."
          ],
          "priority": "Medium"
        }
      ],
      "assumptions": ["The Renderer uses a reactive state (Zustand/Redux) that triggers re-renders on settings change."],
      "open_questions": []
    }
  ]
}

```