import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnPurchaseOrderEntity } from '../../../entities/transactions/TrnPurchaseOrder.entity'
import { BaseService } from '../../base.service'
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './dto'

/**
 * Interface defining the specific operations for the PurchaseOrder service.
 */
export interface IPurchaseOrderService {
  // Add any PurchaseOrder-specific methods here if needed
}

/**
 * Service handling TrnPurchaseOrderEntity CRUD and validations.
 */
export class PurchaseOrderService extends BaseService<TrnPurchaseOrderEntity> implements IPurchaseOrderService {
  constructor() {
    super(TrnPurchaseOrderEntity)
  }

  /**
   * Search fields for PurchaseOrder keyword search.
   */
  protected get searchFields(): string[] {
    return ['purchaseOrderNumber', 'remarks']
  }

  /**
   * Validates before creating a new PurchaseOrder.
   */
  protected async validateCreate(data: DeepPartial<TrnPurchaseOrderEntity>): Promise<void> {
    const dto = await transformAndValidate(CreatePurchaseOrderDto, data)
    
    const existing = await this.repository.findOneBy({ purchaseOrderNumber: dto.purchaseOrderNumber })
    if (existing) {
      throw new BadRequestException(`Purchase Order Number '${dto.purchaseOrderNumber}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing PurchaseOrder.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnPurchaseOrderEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Purchase Order not found for update.')
    }

    const dto = await transformAndValidate(UpdatePurchaseOrderDto, data)

    if (dto.purchaseOrderNumber && dto.purchaseOrderNumber !== current.purchaseOrderNumber) {
      const existing = await this.repository.findOneBy({ purchaseOrderNumber: dto.purchaseOrderNumber })
      if (existing) {
        throw new BadRequestException(`Purchase Order Number '${dto.purchaseOrderNumber}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a PurchaseOrder.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Purchase Order not found for deletion.')
    }
  }
}
