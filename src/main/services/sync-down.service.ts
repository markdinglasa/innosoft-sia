import { AppDataSource } from '../typeORM/configurations'
import { LocalDataSource } from '../typeORM/local-configurations'
import { 
  MirrorItemEntity, MirrorUnitEntity, MirrorTaxEntity, MirrorUserEntity,
  MirrorDiscountEntity, MirrorPayTypeEntity, MirrorBranchEntity, MirrorTerminalEntity, MirrorCustomerEntity 
} from '../entities/mirror'
import connectivityService from './connectivity.service'

/**
 * Sync Down Service — Replicates master data from MSSQL to SQLite shadow tables.
 * This enables offline lookups and ensures data consistency during outages.
 */
class SyncDownService {
  private isRunning = false

  /**
   * Performs a full sync of all mirrored entities.
   * Usually called on first startup or when explicitly requested.
   */
  async fullSync(): Promise<void> {
    if (this.isRunning || !connectivityService.isOnline()) return
    this.isRunning = true

    console.log('[SyncDown] Starting full data replication...')
    try {
      await this.syncEntity('MstItem', MirrorItemEntity)
      await this.syncEntity('MstUnit', MirrorUnitEntity)
      await this.syncEntity('MstTax', MirrorTaxEntity)
      await this.syncEntity('MstUser', MirrorUserEntity)
      await this.syncEntity('MstDiscount', MirrorDiscountEntity)
      await this.syncEntity('MstPayType', MirrorPayTypeEntity)
      await this.syncEntity('MstBranch', MirrorBranchEntity)
      await this.syncEntity('MstTerminal', MirrorTerminalEntity)
      await this.syncEntity('MstCustomer', MirrorCustomerEntity)
      console.log('[SyncDown] Full sync completed successfully.')
    } catch (err) {
      console.error('[SyncDown] Sync failed:', err)
    } finally {
      this.isRunning = false
    }
  }

  /**
   * Replicates all records from an MSSQL table to its SQLite mirror.
   * Uses a truncate-and-replace strategy for simplicity in V1.
   */
  private async syncEntity(tableName: string, mirrorEntity: any): Promise<void> {
    const remoteRepo = AppDataSource.getRepository(tableName)
    const localRepo = LocalDataSource.getRepository(mirrorEntity)

    // 1. Fetch all from remote
    const remoteData = await remoteRepo.find()
    console.log(`[SyncDown] Fetched ${remoteData.length} records from ${tableName}`)

    // 2. Save to local (upsert)
    // We use save() which will handle insertion or update based on the ID
    await localRepo.save(remoteData)
    console.log(`[SyncDown] Mirrored ${tableName} locally.`)
  }

  /**
   * Starts periodic background syncing (e.g., every 30 minutes).
   */
  startPeriodicSync(intervalMs = 30 * 60 * 1000): void {
    setInterval(() => {
      this.fullSync()
    }, intervalMs)
    
    // Also trigger on first start if online
    if (connectivityService.isOnline()) {
      this.fullSync()
    }
  }
}

export default new SyncDownService()
