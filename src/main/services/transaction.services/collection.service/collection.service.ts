import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnCollectionEntity } from '../../../entities/transactions/TrnCollection.entity'
import { BaseService } from '../../base.service'
import { CreateCollectionDto, UpdateCollectionDto } from './dto'

/**
 * Interface defining the specific operations for the Collection service.
 */
export interface ICollectionService {
  // Add any Collection-specific methods here if needed
}

/**
 * Service handling TrnCollectionEntity CRUD and validations.
 */
export class CollectionService extends BaseService<TrnCollectionEntity> implements ICollectionService {
  constructor() {
    super(TrnCollectionEntity)
  }

  /**
   * Search fields for Collection keyword search.
   */
  protected get searchFields(): string[] {
    return ['collectionNumber', 'manualORNumber', 'remarks', 'postCode']
  }

  /**
   * Validates before creating a new Collection.
   */
  protected async validateCreate(data: DeepPartial<TrnCollectionEntity>): Promise<void> {
    const dto = await transformAndValidate(CreateCollectionDto, data)
    
    const existing = await this.repository.findOneBy({ collectionNumber: dto.collectionNumber })
    if (existing) {
      throw new BadRequestException(`Collection Number '${dto.collectionNumber}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Collection.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnCollectionEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Collection not found for update.')
    }

    const dto = await transformAndValidate(UpdateCollectionDto, data)

    if (dto.collectionNumber && dto.collectionNumber !== current.collectionNumber) {
      const existing = await this.repository.findOneBy({ collectionNumber: dto.collectionNumber })
      if (existing) {
        throw new BadRequestException(`Collection Number '${dto.collectionNumber}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Collection.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Collection not found for deletion.')
    }

    if (current.collectionLines && current.collectionLines.length > 0) {
      throw new BadRequestException('Cannot delete Collection because it has associated collection lines.')
    }
  }
}
