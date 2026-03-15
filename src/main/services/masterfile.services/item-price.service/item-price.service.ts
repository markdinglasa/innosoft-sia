import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstItemPriceEntity } from '../../../entities/masterfiles/MstItemPrice.entity'
import { BaseService } from '../../base.service'
import { CreateItemPriceDto, UpdateItemPriceDto } from './dto'

export interface IItemPriceService {
  // Add specific ItemPrice methods here later
}

export class ItemPriceService extends BaseService<MstItemPriceEntity> implements IItemPriceService {
  constructor() {
    super(MstItemPriceEntity)
  }

  /**
   * Search fields for ItemPrice keyword search.
   */
  protected get searchFields(): string[] {
    return ['priceDescription', 'itemId']
  }

  /**
   * Validates before creating a new ItemPrice.
   * Ensures the item-description combination is unique.
   */
  protected async validateCreate(data: DeepPartial<MstItemPriceEntity>): Promise<void> {
    const priceDto = await transformAndValidate(CreateItemPriceDto, data)

    const existingPrice = await this.repository.findOneBy({ 
      itemId: priceDto.itemId,
      priceDescription: priceDto.priceDescription
    })
    
    if (existingPrice) {
      throw new BadRequestException(`Price description '${priceDto.priceDescription}' already exists for this item.`)
    }
  }

  /**
   * Validates before updating an existing ItemPrice.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstItemPriceEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Item Price not found for update.')
    }

    const priceDto = await transformAndValidate(UpdateItemPriceDto, data)
    
    const itemId = priceDto.itemId ?? currentEntity.itemId
    const priceDescription = priceDto.priceDescription ?? currentEntity.priceDescription

    if (itemId !== currentEntity.itemId || priceDescription !== currentEntity.priceDescription) {
      const existingPrice = await this.repository.findOneBy({ 
        itemId,
        priceDescription
      })
      
      if (existingPrice) {
        throw new BadRequestException(`Price description '${priceDescription}' already exists for this item.`)
      }
    }
  }

  /**
   * Validates before deleting an ItemPrice.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Item Price not found for deletion.')
    }
  }
}
