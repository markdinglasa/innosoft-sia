import {
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  Repository
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { AppDataSource } from '../typeORM/configurations'

/**
 * Interface defining the standard CRUD operations for a service.
 */
export interface IBaseService<T> {
  list(options?: FindManyOptions<T>): Promise<T[]>
  get(id: any, options?: FindOneOptions<T>): Promise<T | null>
  create(data: DeepPartial<T>): Promise<T>
  update(id: any, data: QueryDeepPartialEntity<T>): Promise<T | null>
  delete(id: any): Promise<boolean>
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
   * Retrieves a list of entities based on the provided options.
   * @param options FindManyOptions for filtering, sorting, etc.
   */
  async list(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options)
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
   * Creates and saves a new entity.
   * @param data Partial data for the new entity.
   */
  async create(data: DeepPartial<T>): Promise<T> {
    const newItem = this.repository.create(data)
    return await this.repository.save(newItem)
  }

  /**
   * Updates an existing entity by its ID.
   * @param id The primary key value.
   * @param data Partial data for updates.
   */
  async update(id: any, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    await this.repository.update(id, data)
    return await this.get(id)
  }

  /**
   * Deletes an entity by its ID.
   * @param id The primary key value.
   */
  async delete(id: any): Promise<boolean> {
    const result = await this.repository.delete(id)
    return result.affected !== 0
  }
}
