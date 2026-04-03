# Implementation Plan: Tabbed Settings Page

## Overview
Refactor the `Settings` component into a tab-based layout using MUI `Tabs` and `Tab`. This will allow users to navigate between different categories of settings, such as Account and Terminal settings, in a structured and organized manner.

## Requirements
- Implement MUI `Tabs` and `Tab` interface within `settings.tsx`.
- Create at least two tabs: **Account Settings** and **Terminal Settings**.
- Terminal Settings should integrate with `SysSettings` data via TanStack Query.
- Account Settings should (eventually) integrate with the current user's profile/auth state.
- Ensure smooth transitions between tabs and appropriate loading states.

## Architecture Changes
1. **Updated Component**: `src/renderer/src/POS/features/sys-settings/components/settings.tsx` — Main container with state for active tab.
2. **New Directory**: `src/renderer/src/POS/features/sys-settings/components/tabs/` — Contains individual tab components.
3. **New Component**: `src/renderer/src/POS/features/sys-settings/components/tabs/account-tab.tsx` — Account settings view.
4. **New Component**: `src/renderer/src/POS/features/sys-settings/components/tabs/terminal-tab.tsx` — Terminal-specific settings (PRN, drawer, analyzer, etc.).
5. **New API Hook**: Update `sys-settings.mutations.ts` to support updating settings (if not already there).

## Implementation Steps

### Phase 1: Tab Infrastructure
1. **Update Settings Container** (File: `src/renderer/src/POS/features/sys-settings/components/settings.tsx`)
   - Action: Implement `useState` for active tab.
   - Action: Add MUI `<Tabs>` and `<Tab>` components.
   - Action: Create a `TabPanel` helper or use standard MUI Box logic.
   - Why: Foundation for the tabbed UI.
   - Dependencies: MUI installed.
   - Risk: Low.

### Phase 2: Terminal Settings Tab
2. **Create Terminal Tab** (File: `src/renderer/src/POS/features/sys-settings/components/tabs/terminal-tab.tsx`)
   - Action: Use `useActiveTerminalId` and `useSysSettings` from queries.
   - Action: Build the form (Switch/React-hook-form) for terminal-specific flags (drawer, print analysis, etc.).
   - Action: Integrate `useUpdateSettings` mutation (to be created).
   - Why: Direct control over terminal behavior ($SysSettings$).
   - Dependencies: Phase 1 & queries/mutations.
   - Risk: Medium - Form complexity with many boolean fields.

### Phase 3: Account Settings Tab
3. **Create Account Tab** (File: `src/renderer/src/POS/features/sys-settings/components/tabs/account-tab.tsx`)
   - Action: Build placeholder or basic profile summary.
   - Action: Add password change section.
   - Why: User management area.
   - Dependencies: None.
   - Risk: Low.

### Phase 4: Integration & Polish
4. **Update feature index** (File: `src/renderer/src/POS/features/sys-settings/components/index.ts`)
   - Action: Ensure all new components are exported.
   - Why: Facilitate clean imports elsewhere.

## Testing Strategy
- **Unit Tests**: Test tab switching state logic.
- **Integration Tests**: Verify that updating a setting in the Terminal Tab correctly invalidates the query cache.
- **Manual QA**: Switch between tabs, check responsiveness, and ensure form values persist/update correctly.

## Success Criteria
- [ ] Users can switch between Account and Terminal tabs easily.
- [ ] Settings values are correctly populated from the query cache.
- [ ] Layout matches the modern aesthetics of the POS system.
- [ ] No visible flickering during tab changes.
