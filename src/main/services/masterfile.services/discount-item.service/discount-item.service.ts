import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstDiscountItemEntity } from '../../../entities/masterfiles/MstDiscountItem.entity'
import { BaseService } from '../../base.service'
import { CreateDiscountItemDto, UpdateDiscountItemDto } from './dto'

export interface IDiscountItemService {
  // Add specific DiscountItem methods here later
}

export class DiscountItemService extends BaseService<MstDiscountItemEntity> implements IDiscountItemService {
  constructor() {
    super(MstDiscountItemEntity)
  }

  /**
   * Search fields for DiscountItem keyword search.
   */
  protected get searchFields(): string[] {
    return ['discountId', 'itemId']
  }

  /**
   * Validates before creating a new DiscountItem.
   * Ensures the discount-item combination is unique.
   */
  protected async validateCreate(data: DeepPartial<MstDiscountItemEntity>): Promise<void> {
    const accessDto = await transformAndValidate(CreateDiscountItemDto, data)

    const existingAccess = await this.repository.findOneBy({ 
      discountId: accessDto.discountId,
      itemId: accessDto.itemId
    })
    
    if (existingAccess) {
      throw new BadRequestException('This item is already assigned to this discount.')
    }
  }

  /**
   * Validates before updating an existing DiscountItem.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstDiscountItemEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Discount Item not found for update.')
    }

    const accessDto = await transformAndValidate(UpdateDiscountItemDto, data)
    
    const discountId = accessDto.discountId ?? currentEntity.discountId
    const itemId = accessDto.itemId ?? currentEntity.itemId

    if (discountId !== currentEntity.discountId || itemId !== currentEntity.itemId) {
      const existingAccess = await this.repository.findOneBy({ 
        discountId,
        itemId
      })
      
      if (existingAccess) {
        throw new BadRequestException('This item is already assigned to this discount.')
      }
    }
  }

  /**
   * Validates before deleting a DiscountItem.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Discount Item not found for deletion.')
    }
  }
}
