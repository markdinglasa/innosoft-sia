import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstItemGroupItemEntity } from '../../../entities/masterfiles/MstItemGroupItem.entity'
import { BaseService } from '../../base.service'
import { CreateItemGroupItemDto, UpdateItemGroupItemDto } from './dto'

export interface IItemGroupItemService {
  // Add specific ItemGroupItem methods here later
}

export class ItemGroupItemService extends BaseService<MstItemGroupItemEntity> implements IItemGroupItemService {
  constructor() {
    super(MstItemGroupItemEntity)
  }

  /**
   * Search fields for ItemGroupItem keyword search.
   * Search by item or item group IDs.
   */
  protected get searchFields(): string[] {
    return ['itemId', 'itemGroupId']
  }

  /**
   * Validates before creating a new ItemGroupItem.
   * Ensures the item-group combination is unique.
   */
  protected async validateCreate(data: DeepPartial<MstItemGroupItemEntity>): Promise<void> {
    const accessDto = await transformAndValidate(CreateItemGroupItemDto, data)

    const existingAccess = await this.repository.findOneBy({ 
      itemId: accessDto.itemId,
      itemGroupId: accessDto.itemGroupId
    })
    
    if (existingAccess) {
      throw new BadRequestException('This item is already assigned to this group.')
    }
  }

  /**
   * Validates before updating an existing ItemGroupItem.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstItemGroupItemEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Item Group Item not found for update.')
    }

    const accessDto = await transformAndValidate(UpdateItemGroupItemDto, data)
    
    const itemId = accessDto.itemId ?? currentEntity.itemId
    const itemGroupId = accessDto.itemGroupId ?? currentEntity.itemGroupId

    if (itemId !== currentEntity.itemId || itemGroupId !== currentEntity.itemGroupId) {
      const existingAccess = await this.repository.findOneBy({ 
        itemId,
        itemGroupId
      })
      
      if (existingAccess) {
        throw new BadRequestException('This item is already assigned to this group.')
      }
    }
  }

  /**
   * Validates before deleting an ItemGroupItem.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Item Group Item not found for deletion.')
    }
  }
}
