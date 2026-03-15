import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstItemComponentEntity } from '../../../entities/masterfiles/MstItemComponent.entity'
import { BaseService } from '../../base.service'
import { CreateItemComponentDto, UpdateItemComponentDto } from './dto'

export interface IItemComponentService {
  // Add specific ItemComponent methods here later
}

export class ItemComponentService extends BaseService<MstItemComponentEntity> implements IItemComponentService {
  constructor() {
    super(MstItemComponentEntity)
  }

  /**
   * Search fields for ItemComponent keyword search.
   * Search by parent or component item IDs.
   */
  protected get searchFields(): string[] {
    return ['itemId', 'componentItemId']
  }

  /**
   * Validates before creating a new ItemComponent.
   * Ensures the parent-component combination is unique.
   */
  protected async validateCreate(data: DeepPartial<MstItemComponentEntity>): Promise<void> {
    const componentDto = await transformAndValidate(CreateItemComponentDto, data)

    const existingComponent = await this.repository.findOneBy({ 
      itemId: componentDto.itemId,
      componentItemId: componentDto.componentItemId
    })
    
    if (existingComponent) {
      throw new BadRequestException('This component is already assigned to this item.')
    }
  }

  /**
   * Validates before updating an existing ItemComponent.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstItemComponentEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Item Component not found for update.')
    }

    const componentDto = await transformAndValidate(UpdateItemComponentDto, data)
    
    const itemId = componentDto.itemId ?? currentEntity.itemId
    const componentItemId = componentDto.componentItemId ?? currentEntity.componentItemId

    if (itemId !== currentEntity.itemId || componentItemId !== currentEntity.componentItemId) {
      const existingComponent = await this.repository.findOneBy({ 
        itemId,
        componentItemId
      })
      
      if (existingComponent) {
        throw new BadRequestException('This component is already assigned to this item.')
      }
    }
  }

  /**
   * Validates before deleting an ItemComponent.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Item Component not found for deletion.')
    }
  }
}
