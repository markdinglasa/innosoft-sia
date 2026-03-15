import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnOrderLineEntity } from '../../../entities/transactions/TrnOrderLine.entity'
import { BaseService } from '../../base.service'
import { CreateOrderLineDto, UpdateOrderLineDto } from './dto'

/**
 * Interface defining the specific operations for the OrderLine service.
 */
export interface IOrderLineService {
  // Add any OrderLine-specific methods here if needed
}

/**
 * Service handling TrnOrderLineEntity CRUD and validations.
 */
export class OrderLineService extends BaseService<TrnOrderLineEntity> implements IOrderLineService {
  constructor() {
    super(TrnOrderLineEntity)
  }

  /**
   * Search fields for OrderLine keyword search.
   */
  protected get searchFields(): string[] {
    return ['preparation']
  }

  /**
   * Validates before creating a new OrderLine.
   */
  protected async validateCreate(data: DeepPartial<TrnOrderLineEntity>): Promise<void> {
    await transformAndValidate(CreateOrderLineDto, data)
  }

  /**
   * Validates before updating an existing OrderLine.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnOrderLineEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Order Line not found for update.')
    }

    await transformAndValidate(UpdateOrderLineDto, data)
  }

  /**
   * Validates before deleting an OrderLine.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Order Line not found for deletion.')
    }
  }
}
