import { AppDataSource } from '../typeORM/configurations'
import { mainWindow } from '../'
import { ConnectivityChannel } from '@shared/constants'

type ConnectivityStatus = { online: boolean }

let _online = false
let _timer: ReturnType<typeof setInterval> | null = null
const POLL_INTERVAL_MS = 10_000

/**
 * Checks MSSQL connectivity by running a lightweight SELECT 1 query.
 * Returns true if the query succeeds within a reasonable time.
 */
const checkMssqlConnection = async (): Promise<boolean> => {
  try {
    if (!AppDataSource.isInitialized) return false
    await AppDataSource.query('SELECT 1')
    return true
  } catch {
    return false
  }
}

/**
 * Broadcasts the current online status to the renderer via IPC.
 */
const broadcast = (status: ConnectivityStatus): void => {
  try {
    mainWindow?.webContents.send(ConnectivityChannel.changed, status)
  } catch {
    // Window might not be ready yet
  }
}

/**
 * Runs a single connectivity check and updates state.
 * If the state changes, broadcasts to the renderer and calls registered listeners.
 */
const poll = async (): Promise<void> => {
  const nowOnline = await checkMssqlConnection()
  if (nowOnline !== _online) {
    _online = nowOnline
    broadcast({ online: _online })
    console.log(`[Connectivity] Status changed: ${_online ? 'ONLINE' : 'OFFLINE'}`)
    // Notify registered listeners
    _listeners.forEach((fn) => fn(_online))
  }
}

/** External listeners (e.g. SyncEngine registers here) */
const _listeners: Array<(online: boolean) => void> = []

const connectivityService = {
  /**
   * Starts the connectivity polling loop.
   * Call this once on app startup.
   */
  start(): void {
    if (_timer) return
    // Run immediately, then on interval
    poll()
    _timer = setInterval(poll, POLL_INTERVAL_MS)
    console.log(`[Connectivity] Polling started (every ${POLL_INTERVAL_MS / 1000}s)`)
  },

  stop(): void {
    if (_timer) {
      clearInterval(_timer)
      _timer = null
    }
  },

  /** Current connectivity status */
  isOnline(): boolean {
    return _online
  },

  /** Register a callback that fires whenever connectivity changes */
  onChange(fn: (online: boolean) => void): void {
    _listeners.push(fn)
  }
}

export default connectivityService
