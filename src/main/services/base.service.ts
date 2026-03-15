import {
  Between,
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  ObjectLiteral,
  Repository
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { MutationResponse, PaginatedResponse, PaginationOptionsDto } from '../../shared/types/pagination'
import { AppDataSource } from '../typeORM/configurations'

/**
 * Interface defining the standard CRUD operations for a service.
 */
export interface IBaseService<T> {
  list(options?: PaginationOptionsDto): Promise<T[] | PaginatedResponse<T>>
  get(id: any, options?: FindOneOptions<T>): Promise<T | null>
  create(data: DeepPartial<T>): Promise<MutationResponse<T>>
  update(id: any, data: QueryDeepPartialEntity<T>): Promise<MutationResponse<T>>
  delete(id: any): Promise<MutationResponse<T>>
}

/**
 * Abstract base service class providing standard CRUD operations using TypeORM.
 * Must be extended by specific services.
 */
export abstract class BaseService<T extends ObjectLiteral> implements IBaseService<T> {
  constructor(protected readonly entity: EntityTarget<T>) {}

  /**
   * Returns the TypeORM repository for the entity.
   */
  protected get repository(): Repository<T> {
    return AppDataSource.getRepository(this.entity)
  }

  /**
   * Optional search fields for the entity.
   * Child classes should override this to enable keyword searching.
   */
  protected get searchFields(): string[] {
    return []
  }

  /**
   * Retrieves a list of entities based on the provided options.
   * This handles pagination, limiting, and keyword search.
   */
  async list(options?: PaginationOptionsDto): Promise<T[] | PaginatedResponse<T>> {
    const { page = 1, limit = 10, search = '', orderBy = 'id', order = 'DESC' } = options || {}

    // If no pagination is requested (limit is explicitly null/0 or page is not provided), 
    // we could return everything, but for this app let's enforce pagination.
    const skip = (page - 1) * limit

    const findOptions: FindManyOptions<T> = {
      take: limit,
      skip: skip,
      order: { [orderBy]: order } as any
    }

    // Apply keyword search if search string and fields are provided
    if (search && this.searchFields.length > 0) {
      findOptions.where = this.searchFields.map((field) => ({
        [field]: ILike(`%${search}%`)
      })) as any
    }

//     {
//   "filters": [
//     { "createdAt": { "$between": ["2023-01-01", "2023-12-31"] } }
//   ]
// }
// {
//   "filters": [
//     { "price": { "$gte": 100 } }
//   ]
// }
// {
//   "filters": [
//     { "expiryDate": { "$lte": "2024-12-31" } }
//   ]
// }


    // filters
    if (options?.filters && options.filters.length > 0) {
      const mergedFilters = options.filters.reduce((acc, curr) => {
        // Process each filter to handle special operators (like date ranges)
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

      findOptions.where = {
        ...(findOptions.where as any),
        ...mergedFilters
      }
    }

    

    const [items, totalItems] = await this.repository.findAndCount(findOptions)

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
    // We assume 'id' as the default primary key name for Base lookups.
    return await this.repository.findOneBy({ id } as any)
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
   * @param data Partial data for the new entity.
   */
  async create(data: DeepPartial<T>): Promise<MutationResponse<T>> {
    await this.validateCreate(data)
    const newItem = this.repository.create(data)
    const result = await this.repository.save(newItem)
    return {
      metadata: result,
      success: true,
      message: 'Item created successfully'
    }
  }

  /**
   * Updates an existing entity by its ID.
   * @param id The primary key value.
   * @param data Partial data for updates.
   */
  async update(id: any, data: QueryDeepPartialEntity<T>): Promise<MutationResponse<T>> {
    await this.validateUpdate(id, data)
    await this.repository.update(id, data)
    return {
      success: true,
      message: 'Item updated successfully'
    }
  }

  /**
   * Deletes an entity by its ID.
   * @param id The primary key value.
   */
  async delete(id: any): Promise<MutationResponse<T>> {
    await this.validateDelete(id)
    const result = await this.repository.delete(id)
    return {
      success: result.affected !== 0,
      message: 'Item deleted successfully'
    }
  }
}

