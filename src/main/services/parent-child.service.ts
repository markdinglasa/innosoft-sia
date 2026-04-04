import { ObjectLiteral, DeepPartial, EntityTarget } from 'typeorm'
import { BaseService } from './base.service'
import { AppDataSource } from '../typeORM/configurations'
import { ParentChildSavePayload, ParentChildSaveResult } from '@shared/types/masterfile.types'

/**
 * Configuration for a child entity sync.
 */
export interface ChildSyncConfig {
  entity: EntityTarget<any>
  foreignKey: string
  payloadKey: string // The key in the payload object containing children for this entity
}

/**
 * Enhanced service to handle entities with multiple parent-child relationships.
 * Implements TECH-MST-001 (Generic Parent-Child CRUD Engine).
 */
export abstract class ParentChildService<T extends ObjectLiteral> extends BaseService<T> {
  constructor(
    protected readonly parentEntity: EntityTarget<T>,
    protected readonly childConfigs: ChildSyncConfig[] = []
  ) {
    super(parentEntity)
  }

  /**
   * Transactional save for parent and its multiple collections of children.
   * Compares the new children lists with existing children and performs Insert/Update/Remove.
   */
  async saveWithChildren(
    payload: ParentChildSavePayload<DeepPartial<T>, any>,
    userId?: number
  ): Promise<ParentChildSaveResult> {
    const { parent } = payload

    return await AppDataSource.transaction(async (manager) => {
      const parentRepo = manager.getRepository(this.parentEntity)

      // 1. Save or Update Parent
      const savedParent = await parentRepo.save(parent)
      const parentId = (savedParent as any).id

      let totalInserted = 0
      let totalUpdated = 0
      let totalRemoved = 0

      // 2. Sync each child collection based on config
      for (const config of this.childConfigs) {
        const childRepo = manager.getRepository(config.entity)
        const submittedChildren = (payload as any)[config.payloadKey] || []

        // Fetch existing children for this specific foreign key
        const existingChildren = await childRepo.find({
          where: { [config.foreignKey]: parentId } as any
        })
        const existingChildIds = existingChildren.map((child: any) => child.id)

        // Prep submitted rows with parent ID
        const normalizedSubmitted = submittedChildren.map((child: any) => ({
          ...child,
          [config.foreignKey]: parentId
        }))

        // Detect deletions
        const incomingChildIds = submittedChildren
          .filter((c: any) => c.id)
          .map((c: any) => c.id)

        const childIdsToRemove = existingChildIds.filter((id) => !incomingChildIds.includes(id))

        if (childIdsToRemove.length > 0) {
          await childRepo.delete(childIdsToRemove)
          totalRemoved += childIdsToRemove.length
        }

        // Save (Upsert)
        const savedChildren = await childRepo.save(normalizedSubmitted)

        const currentInserted = savedChildren.filter((c: any) => !existingChildIds.includes(c.id)).length
        totalInserted += currentInserted
        totalUpdated += (savedChildren.length - currentInserted)
      }

      // 3. Audit Trail
      if (userId) {
        await this.audit({
          userId,
          action: 'SAVE_WITH_CHILDREN',
          recordId: parentId.toString(),
          newData: { parent: savedParent, syncStats: { totalInserted, totalRemoved } }
        })
      }

      return {
        success: true,
        parentId,
        updatedAt: (savedParent as any).updatedAt || new Date().toISOString(),
        insertedChildren: totalInserted,
        updatedChildren: totalUpdated,
        removedChildren: totalRemoved,
        message: 'Parent and all child collections synchronized successfully.'
      }
    })
  }
}

