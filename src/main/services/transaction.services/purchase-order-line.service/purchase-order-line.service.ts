import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnPurchaseOrderLineEntity } from '../../../entities/transactions/TrnPurchaseOrderLine.entity'
import { BaseService } from '../../base.service'
import { CreatePurchaseOrderLineDto, UpdatePurchaseOrderLineDto } from './dto'

/**
 * Interface defining the specific operations for the PurchaseOrderLine service.
 */
export interface IPurchaseOrderLineService {
  // Add any PurchaseOrderLine-specific methods here if needed
}

/**
 * Service handling TrnPurchaseOrderLineEntity CRUD and validations.
 */
export class PurchaseOrderLineService extends BaseService<TrnPurchaseOrderLineEntity> implements IPurchaseOrderLineService {
  constructor() {
    super(TrnPurchaseOrderLineEntity)
  }

  /**
   * Search fields for PurchaseOrderLine keyword search.
   */
  protected get searchFields(): string[] {
    return []
  }

  /**
   * Validates before creating a new PurchaseOrderLine.
   */
  protected async validateCreate(data: DeepPartial<TrnPurchaseOrderLineEntity>): Promise<void> {
    await transformAndValidate(CreatePurchaseOrderLineDto, data)
  }

  /**
   * Validates before updating an existing PurchaseOrderLine.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnPurchaseOrderLineEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Purchase Order Line not found for update.')
    }

    await transformAndValidate(UpdatePurchaseOrderLineDto, data)
  }

  /**
   * Validates before deleting a PurchaseOrderLine.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Purchase Order Line not found for deletion.')
    }
  }
}
