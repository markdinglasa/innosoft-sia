import { AppDataSource } from '../typeORM/configurations'
import syncQueueService from './sync-queue.service'
import connectivityService from './connectivity.service'
import { ConnectivityChannel } from '@shared/constants'
import { mainWindow } from '../'

let _isSyncing = false

/**
 * Broadcasts a sync event to the renderer window.
 */
const broadcast = (channel: string, data: any): void => {
  try {
    mainWindow?.webContents.send(channel, data)
  } catch {
    // Window may not be ready
  }
}

/**
 * Replays a single queue item against MSSQL using raw TypeORM queries.
 * Uses the JSON payload stored during offline operation.
 */
const replayItem = async (item: {
  id: number
  tableName: string
  operation: 'CREATE' | 'UPDATE' | 'DELETE'
  payload: string
  entityId: string | null
}): Promise<void> => {
  const payload = JSON.parse(item.payload)

  switch (item.operation) {
    case 'CREATE': {
      // Build parameterized INSERT from payload keys
      const columns = Object.keys(payload)
      if (columns.length === 0) throw new Error('Empty payload for CREATE')
      await AppDataSource.query(
        `INSERT INTO [${item.tableName}] (${columns.map((c) => `[${c}]`).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
        Object.values(payload)
      )
      break
    }
    case 'UPDATE': {
      if (!item.entityId) throw new Error('entityId required for UPDATE')
      const setClauses = Object.keys(payload)
        .map((col) => `[${col}] = ?`)
        .join(', ')
      await AppDataSource.query(
        `UPDATE [${item.tableName}] SET ${setClauses} WHERE [Id] = ?`,
        [...Object.values(payload), item.entityId]
      )
      break
    }
    case 'DELETE': {
      if (!item.entityId) throw new Error('entityId required for DELETE')
      await AppDataSource.query(
        `DELETE FROM [${item.tableName}] WHERE [Id] = ?`,
        [item.entityId]
      )
      break
    }
  }
}

/**
 * Sync Engine — replays the entire pending queue to MSSQL.
 * Called automatically when connectivity is restored.
 */
const syncEngine = {
  /**
   * Registers the sync engine with the connectivity service.
   * Call once on startup, after connectivityService.start().
   */
  register(): void {
    connectivityService.onChange(async (online: boolean) => {
      if (online && !_isSyncing) {
        await syncEngine.flush()
      }
    })
    console.log('[SyncEngine] Registered with connectivity service.')
  },

  /**
   * Replays all pending queue items to MSSQL.
   * Idempotent — safe to call multiple times.
   */
  async flush(): Promise<void> {
    const pendingItems = await syncQueueService.getPending()
    if (pendingItems.length === 0) {
      console.log('[SyncEngine] No pending items to sync.')
      broadcast(ConnectivityChannel.syncComplete, { synced: 0, failed: 0 })
      return
    }

    _isSyncing = true
    console.log(`[SyncEngine] Starting sync of ${pendingItems.length} pending item(s)...`)
    broadcast(ConnectivityChannel.syncProgress, {
      total: pendingItems.length,
      completed: 0,
      isSyncing: true
    })

    let synced = 0
    let failed = 0

    for (const item of pendingItems) {
      try {
        await replayItem(item)
        await syncQueueService.markSynced(item.id)
        synced++
        console.log(`[SyncEngine] Synced item #${item.id} (${item.operation} ${item.tableName})`)
      } catch (err: any) {
        await syncQueueService.markFailed(item.id, err?.message ?? 'Unknown error')
        failed++
        console.error(`[SyncEngine] Failed to sync item #${item.id}:`, err)
      }

      broadcast(ConnectivityChannel.syncProgress, {
        total: pendingItems.length,
        completed: synced + failed,
        isSyncing: true
      })
    }

    _isSyncing = false
    console.log(`[SyncEngine] Sync complete. Synced: ${synced}, Failed: ${failed}`)
    broadcast(ConnectivityChannel.syncComplete, { synced, failed })
  }
}

export default syncEngine
