import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstUnitEntity } from '../../../entities/masterfiles/MstUnit.entity'
import { BaseService } from '../../base.service'
import { CreateUnitDto, UpdateUnitDto } from './dto'

export interface IUnitService {
  // Add specific Unit methods here later
}

export class UnitService extends BaseService<MstUnitEntity> implements IUnitService {
  constructor() {
    super(MstUnitEntity)
  }

  /**
   * Search fields for Unit keyword search.
   */
  protected get searchFields(): string[] {
    return ['unit']
  }

  /**
   * Validates before creating a new Unit.
   * Ensures Unit Name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstUnitEntity>): Promise<void> {
    const unitDto = await transformAndValidate(CreateUnitDto, data)

    const existingName = await this.repository.findOneBy({ unit: unitDto.unit })
    if (existingName) {
      throw new BadRequestException(`Unit '${unitDto.unit}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Unit.
   * Ensures modified Unit Name does not conflict.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstUnitEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Unit not found for update.')
    }

    const unitDto = await transformAndValidate(UpdateUnitDto, data)
    if (unitDto.unit && unitDto.unit !== currentEntity.unit) {
      const existingName = await this.repository.findOneBy({ unit: unitDto.unit })
      if (existingName) {
        throw new BadRequestException(`Unit '${unitDto.unit}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Unit.
   * Ensures they are not in-use.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Unit not found for deletion.')
    }

    // TODO: Implement relational in-use check
  }
}
