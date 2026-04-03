# Implementation Plan: TanStack Query Refactor for Sys-Settings

## Overview
Refactor the current imperative state management of system settings and terminal activation (using custom hooks and Zustand) to use TanStack Query. This will simplify data fetching, automatically handle loading and error states, and ensure coherent cache invalidation after mutations like terminal activation.

## Requirements
- Move terminal fetching and fingerprints to TanStack Query.
- Transition settings initialization (`SETTINGS_GET_MERGED`) to a React Query `useQuery`.
- Handle terminal activation (`USER_TERMINAL_ACTIVATE`) with `useMutation`.
- Maintain correct loading sequence in `SettingsProvider`.
- Deprecate server-state storage in `useSettingsStore`.

## Architecture Changes
1. **New Hook**: `src/renderer/src/POS/features/sys-settings/hooks/use-settings-queries.ts` — Contains queries for `fingerprint`, `activeTerminalId`, `terminals`, and `mergedSettings`.
2. **New Hook**: `src/renderer/src/POS/features/sys-settings/hooks/use-settings-mutations.ts` — Contains mutation for terminal activation.
3. **Updated Component**: `src/renderer/src/POS/features/sys-settings/components/settings-provider.tsx` — Uses new query hooks to block rendering while loading.
4. **Updated Component**: `src/renderer/src/POS/features/sys-settings/components/terminal-activation.tsx` — Uses mutations to activate terminals and invalidates relevant queries.

## Implementation Steps

### Phase 1: Queries and Keys
1. **Define Query Keys and Hooks** (File: `src/renderer/src/POS/features/sys-settings/hooks/use-settings-queries.ts`)
   - Action: Create specific query keys for settings features.
   - Action: Implement `useTerminalFingerprint`, `useActiveTerminalId`, `useAvailableTerminals`, and `useSysSettings`.
   - Why: Decouple fetching logic from components.
   - Dependencies: None.
   - Risk: Low.

### Phase 2: Mutations
2. **Implement Mutations** (File: `src/renderer/src/POS/features/sys-settings/hooks/use-settings-mutations.ts`)
   - Action: Implement `useActivateTerminal` mutation.
   - Action: Add `onSuccess` logic to invalidate `activeTerminalId` and `mergedSettings` queries.
   - Why: Ensure the UI refreshes immediately after activation.
   - Dependencies: Phase 1.
   - Risk: Medium - Ensure IPC response is handled correctly.

### Phase 3: Component Refactoring
3. **Refactor SettingsProvider** (File: `src/renderer/src/POS/features/sys-settings/components/settings-provider.tsx`)
   - Action: Replace `useEffect` + Zustand state with TanStack Query hooks.
   - Action: Show `Loader` based on Query `isLoading` status.
   - Why: Modernize architecture and remove boilerplate.
   - Dependencies: Phase 1.
   - Risk: Low.

4. **Refactor TerminalActivationModal** (File: `src/renderer/src/POS/features/sys-settings/components/terminal-activation.tsx`)
   - Action: Use mutation hook for activation.
   - Action: Use query hooks for fetching terminals list.
   - Why: Unified state management.
   - Dependencies: Phase 1 & 2.
   - Risk: Low.

### Phase 4: Cleanup
5. **Simplify Settings Store** (File: `src/renderer/src/POS/features/sys-settings/store/use-settings-store.ts`)
   - Action: Remove `settings`, `isLoading`, `error` from store if only used locally. Keep only global UI state if necessary.
   - Why: Avoid duplicate state and "source of truth" ambiguity.
   - Risk: Low.

6. **Fix index.ts Exports** (File: `src/renderer/src/POS/features/sys-settings/components/index.ts`)
   - Action: Ensure all new hooks and components are properly exported.

## Testing Strategy
- **Unit Tests**: Test IPC invocation through mocks in React Query wrapper.
- **Integration Tests**: Verify that activating a terminal successfully invalidates the `mergedSettings` cache.
- **Manual QA**: Confirm activation modal pops up on a fresh machine (no active terminal) and disappears after success.

## Risks & Mitigations
- **Risk**: Circular dependencies if queries import from providers that use those queries.
- **Mitigation**: Keep hooks in a dedicated `hooks/` directory separate from components.
- **Risk**: IPC failures in Electron not propagating correctly to Query error state.
- **Mitigation**: Ensure IPC return values are checked for `success` and errors are thrown in the query function.

## Success Criteria
- [ ] Settings fetching logic is handled by TanStack Query.
- [ ] Activation modal successfully triggers invalidation.
- [ ] No manual `useEffect` used for fetching settings in the provider.
- [ ] Code is cleaner and easier to maintain.
