import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SyncStatus {
  isOnline: boolean
  isSyncing: boolean
  pendingCount: number
  totalToSync: number
  syncedCount: number
  lastSyncedAt: string | null
}

const initialState: SyncStatus = {
  isOnline: false,
  isSyncing: false,
  pendingCount: 0,
  totalToSync: 0,
  syncedCount: 0,
  lastSyncedAt: null
}

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload
    },
    setSyncingStatus: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload
    },
    setSyncProgress: (state, action: PayloadAction<{ total: number; completed: number; isSyncing: boolean }>) => {
      state.totalToSync = action.payload.total
      state.syncedCount = action.payload.completed
      state.isSyncing = action.payload.isSyncing
    },
    setSyncComplete: (state) => {
      state.isSyncing = false
      state.lastSyncedAt = new Date().toISOString()
      state.syncedCount = 0
      state.totalToSync = 0
    },
    setPendingCount: (state, action: PayloadAction<number>) => {
      state.pendingCount = action.payload
    }
  }
})

export const {
  setOnlineStatus,
  setSyncingStatus,
  setSyncProgress,
  setSyncComplete,
  setPendingCount
} = syncSlice.actions

export default syncSlice.reducer
