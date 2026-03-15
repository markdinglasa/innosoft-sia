import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstItemEntity } from '../../../entities/masterfiles/MstItem.entity'
import { BaseService } from '../../base.service'
import { CreateItemDto, UpdateItemDto } from './dto'

/**
 * Interface defining the specific operations for the Item service.
 */
export interface IItemService {
  // Add any Item-specific methods here if needed outside the generic CRUD
}

/**
 * Service handling MstItemEntity CRUD and validations.
 */
export class ItemService extends BaseService<MstItemEntity> implements IItemService {
  constructor() {
    super(MstItemEntity)
  }

  /**
   * Search fields for Item keyword search.
   */
  protected get searchFields(): string[] {
    return ['itemCode', 'barCode', 'itemDescription', 'alias', 'genericName']
  }

  /**
   * Validates before creating a new Item.
   * Ensures ItemCode and BarCode are unique.
   */
  protected async validateCreate(data: DeepPartial<MstItemEntity>): Promise<void> {
    const itemDto = await transformAndValidate(CreateItemDto, data)
    
    const existingCode = await this.repository.findOneBy({ itemCode: itemDto.itemCode })
    if (existingCode) {
      throw new BadRequestException(`Item Code '${itemDto.itemCode}' already exists.`)
    }

    const existingBarCode = await this.repository.findOneBy({ barCode: itemDto.barCode })
    if (existingBarCode) {
      throw new BadRequestException(`Bar Code '${itemDto.barCode}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Item.
   * Ensures modified ItemCode and BarCode do not conflict with other existing records.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstItemEntity>): Promise<void> {
    const currentItem = await this.get(id)
    if (!currentItem) {
      throw new BadRequestException('Item not found for update.')
    }

    const itemDto = await transformAndValidate(UpdateItemDto, data)

    // Check if itemCode is being modified to something that already exists
    if (itemDto.itemCode && itemDto.itemCode !== currentItem.itemCode) {
      const existingCode = await this.repository.findOneBy({ itemCode: itemDto.itemCode })
      if (existingCode) {
        throw new BadRequestException(`Item Code '${itemDto.itemCode}' already exists.`)
      }
    }

    // Check if barCode is being modified to something that already exists
    if (itemDto.barCode && itemDto.barCode !== currentItem.barCode) {
      const existingBarCode = await this.repository.findOneBy({ barCode: itemDto.barCode })
      if (existingBarCode) {
        throw new BadRequestException(`Bar Code '${itemDto.barCode}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting an Item.
   * Ensures the item is not in-use (e.g., in transactions, inventory).
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentItem = await this.get(id)
    if (!currentItem) {
      throw new BadRequestException('Item not found for deletion.')
    }

    // TODO: Implement actual in-use checks here in the future
    // e.g. Check SalesInvoiceItemEntity or InventoryEntity
    // const isInUse = await salesItemRepo.findOneBy({ itemId: id })
    // if (isInUse) throw new BadRequestException('Cannot delete Item because it is currently in-use in a transaction.')
  }
}
