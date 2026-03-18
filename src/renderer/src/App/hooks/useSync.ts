import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@shared/types'
import { ConnectivityChannel } from '@shared/constants'
import { 
  setOnlineStatus, 
  setSyncProgress, 
  setSyncComplete,
  setPendingCount 
} from '../store/sync'

/**
 * Custom hook to sync the renderer's Redux state with the main process's 
 * connectivity and synchronization status via IPC.
 */
export const useSync = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // 1. Get initial status
    const getInitialStatus = async () => {
      try {
        const { online } = await window.electron.ipc.invoke(ConnectivityChannel.getStatus)
        dispatch(setOnlineStatus(online))
      } catch (err) {
        console.error('Failed to get initial connectivity status:', err)
      }
    }

    getInitialStatus()

    // 2. Listen for connectivity changes
    const onConnectivityChanged = (status: any) => {
      dispatch(setOnlineStatus(!!status?.online))
    }

    // 3. Listen for sync progress
    const onSyncProgress = (progress: any) => {
      dispatch(setSyncProgress(progress))
    }

    // 4. Listen for sync complete
    const onSyncComplete = () => {
      dispatch(setSyncComplete())
    }

    // Register listeners
    window.electron.ipc.on(ConnectivityChannel.changed, onConnectivityChanged as any)
    window.electron.ipc.on(ConnectivityChannel.syncProgress, onSyncProgress as any)
    window.electron.ipc.on(ConnectivityChannel.syncComplete, onSyncComplete as any)

    // Cleanup listeners on unmount
    return () => {
      window.electron.ipc.removeListener(ConnectivityChannel.changed, onConnectivityChanged as any)
      window.electron.ipc.removeListener(ConnectivityChannel.syncProgress, onSyncProgress as any)
      window.electron.ipc.removeListener(ConnectivityChannel.syncComplete, onSyncComplete as any)
    }
  }, [dispatch])
}
