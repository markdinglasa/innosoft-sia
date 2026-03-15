import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstTableEntity } from '../../../entities/masterfiles/MstTable.entity'
import { BaseService } from '../../base.service'
import { CreateTableDto, UpdateTableDto } from './dto'

export interface ITableService {
  // Add specific Table methods here later
}

export class TableService extends BaseService<MstTableEntity> implements ITableService {
  constructor() {
    super(MstTableEntity)
  }

  /**
   * Search fields for Table keyword search.
   */
  protected get searchFields(): string[] {
    return ['tableCode']
  }

  /**
   * Validates before creating a new Table.
   * Ensures TableCode is unique.
   */
  protected async validateCreate(data: DeepPartial<MstTableEntity>): Promise<void> {
    const tableDto = await transformAndValidate(CreateTableDto, data)

    const existingCode = await this.repository.findOneBy({ tableCode: tableDto.tableCode })
    if (existingCode) {
      throw new BadRequestException(`Table Code '${tableDto.tableCode}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Table.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstTableEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Table not found for update.')
    }

    const tableDto = await transformAndValidate(UpdateTableDto, data)
    if (tableDto.tableCode && tableDto.tableCode !== currentEntity.tableCode) {
      const existingCode = await this.repository.findOneBy({ tableCode: tableDto.tableCode })
      if (existingCode) {
        throw new BadRequestException(`Table Code '${tableDto.tableCode}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Table.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Table not found for deletion.')
    }
  }
}
