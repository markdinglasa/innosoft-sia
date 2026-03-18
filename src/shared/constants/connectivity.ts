/** IPC channel names for connectivity and sync events */
export const ConnectivityChannel = {
  changed: 'connectivity:changed',
  getStatus: 'connectivity:get-status',
  syncProgress: 'sync:progress',
  syncComplete: 'sync:complete',
  getPendingByTable: 'sync:get-pending-by-table',
  resetFailed: 'sync:reset-failed'
} as const
