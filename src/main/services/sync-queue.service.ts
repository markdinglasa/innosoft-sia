import { LocalDataSource, isLocalDbReady } from '../typeORM/local-configurations'
import { SyncQueueEntity, SyncOperation, SyncStatus } from '../entities/utilities/SyncQueue.entity'

/**
 * Service for managing the local SQLite sync queue.
 * All operations are on the LOCAL SQLite database — always available offline.
 */
const syncQueueService = {
  /**
   * Adds a new pending operation to the queue.
   */
  async enqueue(
    tableName: string,
    operation: SyncOperation,
    payload: Record<string, any>,
    entityId?: string | null
  ): Promise<void> {
    if (!isLocalDbReady()) {
      console.warn('[SyncQueue] Local DB not ready — cannot enqueue operation.')
      return
    }
    try {
      const repo = LocalDataSource.getRepository(SyncQueueEntity)
      const entry = repo.create({
        tableName,
        operation,
        payload: JSON.stringify(payload),
        entityId: entityId ?? null,
        status: 'pending' as SyncStatus,
        retries: 0,
        createdAt: new Date(),
        syncedAt: null,
        errorMessage: null
      })
      await repo.save(entry)
      console.log(`[SyncQueue] Enqueued ${operation} on ${tableName} (id: ${entityId ?? 'new'})`)
    } catch (err) {
      console.error('[SyncQueue] Failed to enqueue operation:', err)
    }
  },

  /**
   * Returns all pending queue items, ordered oldest-first (FIFO replay).
   */
  async getPending(): Promise<SyncQueueEntity[]> {
    if (!isLocalDbReady()) return []
    const repo = LocalDataSource.getRepository(SyncQueueEntity)
    return repo.find({
      where: { status: 'pending' },
      order: { createdAt: 'ASC' }
    })
  },

  /**
   * Returns the count of pending items.
   */
  async getPendingCount(): Promise<number> {
    if (!isLocalDbReady()) return 0
    const repo = LocalDataSource.getRepository(SyncQueueEntity)
    return repo.count({ where: { status: 'pending' } })
  },

  /**
   * Returns all pending items for a specific table.
   */
  async getByTable(tableName: string): Promise<SyncQueueEntity[]> {
    if (!isLocalDbReady()) return []
    const repo = LocalDataSource.getRepository(SyncQueueEntity)
    const where: any = { status: 'pending' }
    if (tableName) where.tableName = tableName
    
    return repo.find({
      where,
      order: { createdAt: 'ASC' }
    })
  },

  /**
   * Marks a queue item as successfully synced.
   */
  async markSynced(id: number): Promise<void> {
    if (!isLocalDbReady()) return
    const repo = LocalDataSource.getRepository(SyncQueueEntity)
    await repo.update(id, { status: 'synced', syncedAt: new Date() })
  },

  /**
   * Marks a queue item as failed and increments the retry count.
   */
  async markFailed(id: number, errorMessage?: string): Promise<void> {
    if (!isLocalDbReady()) return
    const repo = LocalDataSource.getRepository(SyncQueueEntity)
    const item = await repo.findOneBy({ id })
    if (item) {
      await repo.update(id, {
        status: 'failed',
        retries: item.retries + 1,
        errorMessage: errorMessage ?? null
      })
    }
  },

  /**
   * Resets all 'failed' items back to 'pending' so they can be retried.
   */
  async resetFailed(): Promise<void> {
    if (!isLocalDbReady()) return
    const repo = LocalDataSource.getRepository(SyncQueueEntity)
    await repo.createQueryBuilder()
      .update(SyncQueueEntity)
      .set({ status: 'pending', errorMessage: null })
      .where('status = :status', { status: 'failed' })
      .execute()
  }
}

export default syncQueueService
