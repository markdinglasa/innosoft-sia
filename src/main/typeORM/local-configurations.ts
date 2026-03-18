import { app } from 'electron'
import path from 'path'
import { DataSource } from 'typeorm'
import { SyncQueueEntity } from '../entities/utilities/SyncQueue.entity'
import { 
  MirrorUnitEntity, MirrorTaxEntity, MirrorItemEntity, MirrorUserEntity,
  MirrorDiscountEntity, MirrorPayTypeEntity, MirrorBranchEntity, MirrorTerminalEntity, MirrorCustomerEntity 
} from '../entities/mirror'

/**
 * Local SQLite DataSource — always available, even when MSSQL is offline.
 * Stores the SyncQueue: a list of pending write operations to be replayed
 * against MSSQL when connectivity is restored.
 */
export const LocalDataSource = new DataSource({
  type: 'better-sqlite3',
  // Store the SQLite file in the user's app data directory so it persists between sessions.
  // We use a fallback path for when this module is loaded before Electron app is ready.
  database: path.join(
    (() => {
      try {
        return app.getPath('userData')
      } catch {
        // Fallback during early init (shouldn't happen in practice)
        return process.env.HOME || '.'
      }
    })(),
    'local-sync.sqlite'
  ),
  synchronize: true, // auto-create tables
  logging: false,
  entities: [
    SyncQueueEntity,
    MirrorUnitEntity,
    MirrorTaxEntity,
    MirrorItemEntity,
    MirrorUserEntity,
    MirrorDiscountEntity,
    MirrorPayTypeEntity,
    MirrorBranchEntity,
    MirrorTerminalEntity,
    MirrorCustomerEntity
  ]
})

let _localInitialized = false

/**
 * Initializes the local SQLite database. Safe to call multiple times — idempotent.
 * This must succeed; a failure here is logged but not fatal to the app.
 */
export const initializeLocalDatabase = async (): Promise<void> => {
  if (_localInitialized || LocalDataSource.isInitialized) {
    _localInitialized = true
    return
  }
  try {
    await LocalDataSource.initialize()
    _localInitialized = true
    console.log('[LocalDB] SQLite local database initialized.')
  } catch (err) {
    console.error('[LocalDB] Failed to initialize local SQLite database:', err)
    // Non-fatal: app continues without offline queue support
  }
}

/**
 * Returns true if the local SQLite database is available and initialized.
 */
export const isLocalDbReady = (): boolean => _localInitialized && LocalDataSource.isInitialized
