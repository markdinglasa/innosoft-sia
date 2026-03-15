import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnCollectionLineEntity } from '../../../entities/transactions/TrnCollectionLine.entity'
import { BaseService } from '../../base.service'
import { CreateCollectionLineDto, UpdateCollectionLineDto } from './dto'

/**
 * Interface defining the specific operations for the CollectionLine service.
 */
export interface ICollectionLineService {
  // Add any CollectionLine-specific methods here if needed
}

/**
 * Service handling TrnCollectionLineEntity CRUD and validations.
 */
export class CollectionLineService extends BaseService<TrnCollectionLineEntity> implements ICollectionLineService {
  constructor() {
    super(TrnCollectionLineEntity)
  }

  /**
   * Search fields for CollectionLine keyword search.
   */
  protected get searchFields(): string[] {
    return [
      'checkNumber',
      'checkBank',
      'creditCardNumber',
      'creditCardType',
      'creditCardBank',
      'giftCertificateNumber',
      'otherInformation',
      'creditCardReferenceNumber',
      'creditCardHolderName'
    ]
  }

  /**
   * Validates before creating a new CollectionLine.
   */
  protected async validateCreate(data: DeepPartial<TrnCollectionLineEntity>): Promise<void> {
    await transformAndValidate(CreateCollectionLineDto, data)
  }

  /**
   * Validates before updating an existing CollectionLine.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnCollectionLineEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Collection Line not found for update.')
    }

    await transformAndValidate(UpdateCollectionLineDto, data)
  }

  /**
   * Validates before deleting a CollectionLine.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Collection Line not found for deletion.')
    }
  }
}
