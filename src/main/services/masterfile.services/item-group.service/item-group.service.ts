import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstItemGroupEntity } from '../../../entities/masterfiles/MstItemGroup.entity'
import { BaseService } from '../../base.service'
import { CreateItemGroupDto, UpdateItemGroupDto } from './dto'

export interface IItemGroupService {
  // Add specific ItemGroup methods here later
}

export class ItemGroupService extends BaseService<MstItemGroupEntity> implements IItemGroupService {
  constructor() {
    super(MstItemGroupEntity)
  }

  /**
   * Search fields for ItemGroup keyword search.
   */
  protected get searchFields(): string[] {
    return ['itemGroup']
  }

  /**
   * Validates before creating a new ItemGroup.
   * Ensures Item Group name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstItemGroupEntity>): Promise<void> {
    const groupDto = await transformAndValidate(CreateItemGroupDto, data)

    const existingName = await this.repository.findOneBy({ name: groupDto.name })
    if (existingName) {
      throw new BadRequestException(`Item Group '${groupDto.name}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing ItemGroup.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstItemGroupEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Item Group not found for update.')
    }

    const groupDto = await transformAndValidate(UpdateItemGroupDto, data)
    if (groupDto.name && groupDto.name !== currentEntity.name) {
      const existingName = await this.repository.findOneBy({ name: groupDto.name })
      if (existingName) {
        throw new BadRequestException(`Item Group '${groupDto.name}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting an ItemGroup.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Item Group not found for deletion.')
    }
  }
}
