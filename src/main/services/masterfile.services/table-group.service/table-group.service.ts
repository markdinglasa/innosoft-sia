import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstTableEntity } from '../../../entities/masterfiles/MstTable.entity'
import { MstTableGroupEntity } from '../../../entities/masterfiles/MstTableGroup.entity'
import { ParentChildService } from '../../parent-child.service'
import { CreateTableGroupDto, UpdateTableGroupDto } from './dto'

export interface ITableGroupService {
  // Add specific TableGroup methods here later
}

export class TableGroupService
  extends ParentChildService<MstTableGroupEntity>
  implements ITableGroupService
{
  constructor() {
    super(MstTableGroupEntity, [
      {
        entity: MstTableEntity,
        foreignKey: 'tableGroupId',
        payloadKey: 'tables'
      }
    ])
  }

  /**
   * Search fields for TableGroup keyword search.
   */
  protected get searchFields(): string[] {
    return ['name']
  }

  /**
   * Relations to include in fetch results.
   */
  protected get listRelations(): string[] {
    return ['tables']
  }

  /**
   * Validates before creating a new TableGroup.
   * Ensures TableGroup name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstTableGroupEntity>): Promise<void> {
    const tableGroupDto = await transformAndValidate(CreateTableGroupDto, data)

    const existingName = await this.repository.findOneBy({ name: tableGroupDto.name })
    if (existingName) {
      throw new BadRequestException(`Table Group '${tableGroupDto.name}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing TableGroup.
   */
  protected async validateUpdate(
    id: any,
    data: QueryDeepPartialEntity<MstTableGroupEntity>
  ): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Table Group not found for update.')
    }

    const tableGroupDto = await transformAndValidate(UpdateTableGroupDto, data)
    if (tableGroupDto.name && tableGroupDto.name !== currentEntity.name) {
      const existingName = await this.repository.findOneBy({ name: tableGroupDto.name })
      if (existingName) {
        throw new BadRequestException(`Table Group '${tableGroupDto.name}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a TableGroup.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Table Group not found for deletion.')
    }

    if (currentEntity.isDefault) {
      throw new BadRequestException('Default Table Group cannot be deleted.')
    }
  }
}

