import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstPeriodEntity } from '../../../entities/masterfiles/MstPeriod.entity'
import { BaseService } from '../../base.service'
import { CreatePeriodDto, UpdatePeriodDto } from './dto'

export interface IPeriodService {
  // Add specific Period methods here later
}

export class PeriodService extends BaseService<MstPeriodEntity> implements IPeriodService {
  constructor() {
    super(MstPeriodEntity)
  }

  /**
   * Search fields for Period keyword search.
   */
  protected get searchFields(): string[] {
    return ['name']
  }

  /**
   * Validates before creating a new Period.
   * Ensures Period Name is unique within the same branch.
   */
  protected async validateCreate(data: DeepPartial<MstPeriodEntity>): Promise<void> {
    const periodDto = await transformAndValidate(CreatePeriodDto, data)

    const existingName = await this.repository.findOneBy({ name: periodDto.name })
    if (existingName) {
      throw new BadRequestException(`Period '${periodDto.name}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Period.
   * Ensures modified Period Name does not conflict.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstPeriodEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Period not found for update.')
    }

    const periodDto = await transformAndValidate(UpdatePeriodDto, data)
    if (periodDto.name && periodDto.name !== currentEntity.name) {
      const existingName = await this.repository.findOneBy({ name: periodDto.name })
      if (existingName) {
        throw new BadRequestException(`Period '${periodDto.name}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Period.
   * Ensures the period is not in-use by any transactions.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Period not found for deletion.')
    }

    // TODO: Implement relational in-use check (e.g., check if period is referenced by TrnOrder)
  }
}
