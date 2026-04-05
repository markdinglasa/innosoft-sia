# Implementation Plan: Terminal Switching Fixes

## Overview
This plan addresses the issue where terminal switching in the settings module does not correctly update the application state or close the UI modal upon successful activation. It also fixes architectural inconsistencies in how terminals are assigned to users during login.

## Requirements
- Activation modal must close automatically on success.
- Redux store must be updated with the newly activated terminal.
- Backend login must correctly resolve the singular active terminal for the user.
- Settings UI should be responsive to terminal changes.

## Architecture Changes
- `src/renderer/src/POS/store/manager.ts`: Export missing `setActiveTerminal` and `setActiveBranches` actions.
- `src/renderer/src/POS/features/authentication/hooks/use-auth.ts`: (Verify only) Ensure consistent property naming.
- `src/main/services/auth.services/auth.service.ts`: Correct the logic for selecting the active terminal from the `userTerminals` relation.
- `src/renderer/src/POS/features/sys-settings/components/terminal-activation.tsx`: Enhance the success flow with dispatch and close events.

## Implementation Steps

### Phase 1: Store & Backend Fixes (2 files)
1. **Export missing manager actions** (File: `src/renderer/src/POS/store/manager.ts`)
   - Action: Add `setActiveBranches` and `setActiveTerminal` to the exported actions list.
   - Why: These actions must be available for components to update the global POS state.
   - Dependencies: None
   - Risk: Low

2. **Fix terminal mapping in Login** (File: `src/main/services/auth.services/auth.service.ts`)
   - Action: Change `.map()` to `.find()` (or `[0]`) to ensure the `terminal` property is a single object, not an array.
   - Why: The `LoginResponse` type expects a single `MstTerminalEntity` object.
   - Dependencies: Requires the `userTerminals` relation to be loaded.
   - Risk: Medium - critical for login functionality.

### Phase 2: UI & Interaction Fixes (1 file)
3. **Enhance Activation Flow** (File: `src/renderer/src/POS/features/sys-settings/components/terminal-activation.tsx`)
   - Action: Update `handleActivate` to dispatch `setActiveTerminal` and call `close()` on successful mutation.
   - Why: Provides a seamless user experience by immediately reflecting changes and clearing the UI.
   - Dependencies: Step 1 (needs exported action).
   - Risk: Low

## Testing Strategy
- **Manual Verification**:
  - Open Settings -> "Switch Terminal".
  - Select an available terminal and click "Activate".
  - Verify success toast appears.
  - Verify modal closes automatically.
  - Verify terminal settings (in the Terminal tab) reflect the new terminal.
- **Unit/Integration tests**: (If time allows) Verify Redux state updates correctly after activation.

## Risks & Mitigations
- **Risk**: Backend activation succeeds but Redux update fails.
  - Mitigation: Use the `onSuccess` callback of the TanStack Query mutation to ensure Redux is only updated after a successful IPC call.
- **Risk**: User has multiple active terminals.
  - Mitigation: Current logic picks the first active one; long-term should perhaps prompt but typically UI prevents multiple activations.

## Success Criteria
- [ ] Activate Terminal button correctly binds a machine.
- [ ] Modal closes on success.
- [ ] App state is updated without requiring a manual refresh.
- [ ] Login successfully identifies the active terminal.
