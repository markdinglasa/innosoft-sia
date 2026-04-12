import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstItemEntity } from '../../../entities/masterfiles/MstItem.entity'
import { MstItemPackageEntity } from '../../../entities/masterfiles/MstItemPackage.entity'
import { MstItemPriceEntity } from '../../../entities/masterfiles/MstItemPrice.entity'
import { AppDataSource } from '../../../typeORM/configurations'
import { ParentChildService } from '../../parent-child.service'
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
export class ItemService extends ParentChildService<MstItemEntity> implements IItemService {
  constructor() {
    super(MstItemEntity, [
      { entity: MstItemPriceEntity, foreignKey: 'itemId', payloadKey: 'itemPrices' },
      { entity: MstItemPackageEntity, foreignKey: 'itemId', payloadKey: 'itemPackages' }
    ])
  }

  /**
   * Search fields for Item keyword search.
   */
  protected get searchFields(): string[] {
    return ['itemCode', 'barCode', 'name', 'description', 'genericName']
  }

  /**
   * Relations to include in fetch results.
   */
  protected get listRelations(): string[] {
    return ['itemPrices', 'itemPackages', 'unit']
  }

  /**
   * Validates before creating a new Item.
   * Ensures ItemCode and BarCode are unique.
   */
  protected async validateCreate(data: DeepPartial<MstItemEntity>): Promise<void> {
    // Provide defaults for technical fields not in form
    data.salesAccountId = data.salesAccountId || 1
    data.assetAccountId = data.assetAccountId || 1
    data.costAccountId = data.costAccountId || 1
    data.inTaxId = data.inTaxId || 1
    data.outTaxId = data.outTaxId || 1
    data.defaultSupplierId = data.defaultSupplierId || 1
    data.genericName = data.genericName || ''
    data.category = data.category || ''
    data.imagePath = data.imagePath || ''
    data.reorderQuantity = data.reorderQuantity || 0
    data.onhandQuantity = data.onhandQuantity || 0
    data.markUp = data.markUp || 0
    data.isInventory = data.isInventory ?? true
    data.isPackage = data.isPackage ?? false

    const itemDto = await transformAndValidate(CreateItemDto, data)

    const existingCode = await this.repository.findOneBy({ itemCode: itemDto.itemCode })
    if (existingCode) {
      throw new BadRequestException(`Item Code '${itemDto.itemCode}' already exists.`)
    }

    const existingBarCode = await this.repository.findOneBy({ barCode: itemDto.barCode })
    if (existingBarCode && itemDto.barCode) {
      throw new BadRequestException(`Bar Code '${itemDto.barCode}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Item.
   * Ensures modified ItemCode and BarCode do not conflict with other existing records.
   */
  protected async validateUpdate(
    id: any,
    data: QueryDeepPartialEntity<MstItemEntity>
  ): Promise<void> {
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
   * Cleans up related records and ensures the item is not in-use.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentItem = await this.get(id)
    if (!currentItem) {
      throw new BadRequestException('Item not found for deletion.')
    }

    // Manual cleanup of related records to satisfy FK constraints
    await AppDataSource.transaction(async (manager) => {
      // 1. Delete Item Prices
      await manager.delete(MstItemPriceEntity, { itemId: id })

      // 2. Delete Item Packages (where this item is the parent)
      await manager.delete(MstItemPackageEntity, { itemId: id })

      // 3. Delete Package references (where this item IS a component of another package)
      await manager.delete(MstItemPackageEntity, { packageItemId: id })
    })

    // TODO: Further in-use checks (SalesInvoice, etc.)
  }
}

