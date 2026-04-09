import {
  Between,
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  Like,
  LessThanOrEqual,
  MoreThanOrEqual,
  ObjectLiteral,
  Repository
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { MutationResponse, PaginatedResponse, PaginationOptionsDto } from '../../shared/types/pagination'
import { SysAuditTrailEntity } from '../entities/utilities/SysAuditTrail.entity'
import { AppDataSource } from '../typeORM/configurations'
import { SYSTEM_SELF } from '@shared/constants'
import Store from '../store/Store'
import connectivityService from './connectivity.service'
import syncQueueService from './sync-queue.service'
import { LocalDataSource } from '../typeORM/local-configurations'
import { getMirrorEntity } from './mirror-map'

/**
 * Interface defining the standard CRUD operations for a service.
 */
export interface IBaseService<T> {
  list(options?: PaginationOptionsDto): Promise<T[] | PaginatedResponse<T>>
  get(id: any, options?: FindOneOptions<T>): Promise<T | null>
  create(data: DeepPartial<T>, userId?: number): Promise<MutationResponse<T>>
  update(id: any, data: QueryDeepPartialEntity<T>, userId?: number): Promise<MutationResponse<T>>
  delete(id: any, userId?: number): Promise<MutationResponse<T>>
}

/**
 * Abstract base service class providing standard CRUD operations using TypeORM.
 * Must be extended by specific services.
 */
export abstract class BaseService<T extends ObjectLiteral> implements IBaseService<T> {
  constructor(protected readonly entity: EntityTarget<T>) {}

  /**
   * Returns the TypeORM repository for the entity.
   * Redirects to local SQLite mirror if offline and a mirror is available.
   */
  protected get repository(): Repository<T> {
    if (!connectivityService.isOnline()) {
      const mirrorEntity = getMirrorEntity(this.entity)
      if (mirrorEntity) {
        console.log(`[BaseService] Offline — falling back to local mirror for ${mirrorEntity.name}`)
        return LocalDataSource.getRepository(mirrorEntity) as unknown as Repository<T>
      }
    }
    return AppDataSource.getRepository(this.entity)
  }

  /**
   * Helper to log audit trail.
   * Directly uses AppDataSource to avoid circular dependency with SysAuditTrailService.
   */
  protected async audit(payload: {
    userId?: number
    action: string
    recordId?: string
    oldData?: any
    newData?: any
  }): Promise<void> {
    // Avoid auditing the audit trail itself
    if (this.entity === SysAuditTrailEntity) return

    const redact = (data: any) => {
      if (!data || typeof data !== 'object') return data
      const sensitiveKeys = ['password', 'secret', 'token', 'key', 'apiKey', 'credential']
      const sanitized = { ...data }
      for (const key of Object.keys(sanitized)) {
        if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
          sanitized[key] = '[REDACTED]'
        } else if (typeof sanitized[key] === 'object') {
          sanitized[key] = redact(sanitized[key])
        }
      }
      return sanitized
    }

    const currentUser = Store.get(SYSTEM_SELF)
    const effectiveUserId = payload.userId || currentUser?.id || 1

    const entityMetadata = AppDataSource.getMetadata(this.entity)
    const tableName = entityMetadata.tableName

    try {
      const auditRepo = AppDataSource.getRepository(SysAuditTrailEntity)
      const auditEntry = auditRepo.create({
        userId: effectiveUserId,
        tableInformation: tableName,
        recordInformation: payload.recordId || 'none',
        actionInformation: payload.action,
        auditDate: new Date(),
        oldData: payload.oldData ? JSON.stringify(redact(payload.oldData)) : null,
        newData: payload.newData ? JSON.stringify(redact(payload.newData)) : null
      })
      await auditRepo.save(auditEntry)
    } catch (error) {
      console.error('Failed to save audit trail:', error)
      // We don't want to fail the main transaction if auditing fails
    }
  }

  /**
   * Optional search fields for the entity.
   * Child classes should override this to enable keyword searching.
   */
  protected get searchFields(): string[] {
    return []
  }

  /**
   * Optional relations to include in list results.
   * Child classes should override this to enable eager loading of related entities in listings.
   */
  protected get listRelations(): string[] {
    return []
  }

  /**
   * Retrieves a list of entities based on the provided options.
   * This handles pagination, limiting, and keyword search.
   */
  async list(options?: PaginationOptionsDto): Promise<T[] | PaginatedResponse<T>> {
    const { page = 1, limit = 30, search = '', orderBy = 'id', order = 'DESC' } = options || {}
    
    // If no pagination is requested (limit is explicitly null/0 or page is not provided), 
    // we could return everything, but for this app let's enforce pagination.
    const skip = (page - 1) * limit

    const findOptions: FindManyOptions<T> = {
      take: limit,
      skip: skip,
      relations: this.listRelations,
      order: { [orderBy]: order } as any
    }

    // Apply keyword search if search string and fields are provided
    if (search && this.searchFields.length > 0) {
      findOptions.where = this.searchFields.map((field) => ({
        [field]: Like(`%${search}%`)
      })) as any
    }

    // Process and Merge Filters
    if (options?.filters && options.filters.length > 0) {
      const mergedFilters = options.filters.reduce((acc, curr) => {
        const processedFilter = Object.keys(curr).reduce((pAcc, key) => {
          const value = curr[key]
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            if (value.$between && Array.isArray(value.$between)) {
              pAcc[key] = Between(value.$between[0], value.$between[1])
            } else if (value.$gte !== undefined) {
              pAcc[key] = MoreThanOrEqual(value.$gte)
            } else if (value.$lte !== undefined) {
              pAcc[key] = LessThanOrEqual(value.$lte)
            } else {
              pAcc[key] = value
            }
          } else {
            pAcc[key] = value
          }
          return pAcc
        }, {} as any)

        return { ...acc, ...processedFilter }
      }, {})

      // Robustly merge with existing search-based where (which might be an OR-array)
      if (Array.isArray(findOptions.where)) {
        findOptions.where = findOptions.where.map((orCond) => ({
          ...orCond,
          ...mergedFilters
        }))
      } else {
        findOptions.where = {
          ...(findOptions.where as any),
          ...mergedFilters
        }
      }
    }

    

    const [items, totalItems] = await this.repository.findAndCount(findOptions)

    await this.audit({
      action: 'View List',
      newData: {
        totalItems,
        page: findOptions.skip! / findOptions.take! + 1,
        limit: findOptions.take,
        search,
        filters: options?.filters
      }
    })

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
      }
    }
  }

  /**
   * Retrieves a single entity by its ID or based on options.
   * @param id The primary key value.
   * @param options FindOneOptions for more complex queries.
   */
  async get(id: any, options?: FindOneOptions<T>): Promise<T | null> {
    if (options) {
      return await this.repository.findOne(options)
    }

    const result = await this.repository.findOne({
      where: { id } as any,
      relations: this.listRelations
    })

    // audit trail
    await this.audit({
      action: 'View Details',
      recordId: id.toString(),
      newData: result
    })

    // We assume 'id' as the default primary key name for Base lookups.
    return result
  }

  /**
   * Optional validation hook called before creating an entity.
   * Override this to check for duplicates (e.g., throwing BadRequestException).
   */
  protected async validateCreate(_data: DeepPartial<T>): Promise<void> {}

  /**
   * Optional validation hook called before updating an entity.
   * Override this to check if a non-id unique constraint was modified to a duplicate.
   */
  protected async validateUpdate(_id: any, _data: QueryDeepPartialEntity<T>): Promise<void> {}

  /**
   * Optional validation hook called before deleting an entity.
   * Override this to check if the entity is currently in-use to prevent constraint violations.
   */
  protected async validateDelete(_id: any): Promise<void> {}

  /**
   * Creates and saves a new entity.
   * If offline, enqueues the operation to the local SQLite sync queue.
   * @param data Partial data for the new entity.
   * @param userId ID of the user performing the action.
   */
  async create(data: DeepPartial<T>, userId?: number): Promise<MutationResponse<T>> {
    // --- OFFLINE FALLBACK ---
    if (!connectivityService.isOnline()) {
      const tableName = AppDataSource.hasMetadata(this.entity)
        ? AppDataSource.getMetadata(this.entity).tableName
        : String(this.entity)
      await syncQueueService.enqueue(tableName, 'CREATE', data as Record<string, any>, null)
      console.warn(`[BaseService] Offline — queued CREATE for ${tableName}`)
      return {
        metadata: data as T,
        success: true,
        message: 'Saved locally. Will sync when online.'
      }
    }
    // --- ONLINE PATH (original behavior) ---
    await this.validateCreate(data)
    const newItem = this.repository.create(data)
    const result = await this.repository.save(newItem)

    if (userId) {
      await this.audit({
        userId,
        action: 'CREATE',
        recordId: (result as any).id?.toString() || 'unknown',
        newData: result
      })
    }

    return {
      metadata: result,
      success: true,
      message: 'Created successfully'
    }
  }

  /**
   * Updates an existing entity by its ID.
   * If offline, enqueues the operation to the local SQLite sync queue.
   * @param id The primary key value.
   * @param data Partial data for updates.
   * @param userId ID of the user performing the action.
   */
  async update(id: any, data: QueryDeepPartialEntity<T>, userId?: number): Promise<MutationResponse<T>> {
    // --- OFFLINE FALLBACK ---
    if (!connectivityService.isOnline()) {
      const tableName = AppDataSource.hasMetadata(this.entity)
        ? AppDataSource.getMetadata(this.entity).tableName
        : String(this.entity)
      await syncQueueService.enqueue(tableName, 'UPDATE', data as Record<string, any>, String(id))
      console.warn(`[BaseService] Offline — queued UPDATE for ${tableName} id=${id}`)
      return { success: true, message: 'Saved locally. Will sync when online.' }
    }
    // --- ONLINE PATH (original behavior) ---
    await this.validateUpdate(id, data)

    let oldData: T | null = null
    if (userId) {
      oldData = await this.get(id)
    }

    await this.repository.update(id, data)
    const result = await this.get(id)

    if (userId && oldData && result) {
      await this.audit({
        userId,
        action: 'UPDATE',
        recordId: id.toString(),
        oldData,
        newData: result
      })
    }

    return {
      success: true,
      message: 'Updated successfully'
    }
  }

  /**
   * Deletes an entity by its ID.
   * If offline, enqueues the operation to the local SQLite sync queue.
   * @param id The primary key value.
   * @param userId ID of the user performing the action.
   */
  async delete(id: any, userId?: number): Promise<MutationResponse<T>> {
    // --- OFFLINE FALLBACK ---
    if (!connectivityService.isOnline()) {
      const tableName = AppDataSource.hasMetadata(this.entity)
        ? AppDataSource.getMetadata(this.entity).tableName
        : String(this.entity)
      await syncQueueService.enqueue(tableName, 'DELETE', {}, String(id))
      console.warn(`[BaseService] Offline — queued DELETE for ${tableName} id=${id}`)
      return { success: true, message: 'Queued for deletion. Will sync when online.' }
    }
    // --- ONLINE PATH (original behavior) ---
    await this.validateDelete(id)

    let oldData: T | null = null
    if (userId) {
      oldData = await this.get(id)
    }

    const result = await this.repository.delete(id)

    if (userId && oldData && result.affected !== 0) {
      await this.audit({
        userId,
        action: 'DELETE',
        recordId: id.toString(),
        oldData
      })
    }

    return {
      success: result.affected !== 0,
      message: 'Deleted successfully'
    }
  }
}

