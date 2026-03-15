import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnPaxTableEntity } from '../../../entities/transactions/TrnPaxTable.entity'
import { BaseService } from '../../base.service'
import { CreatePaxTableDto, UpdatePaxTableDto } from './dto'

/**
 * Interface defining the specific operations for the PaxTable service.
 */
export interface IPaxTableService {
  // Add any PaxTable-specific methods here if needed
}

/**
 * Service handling TrnPaxTableEntity CRUD and validations.
 */
export class PaxTableService extends BaseService<TrnPaxTableEntity> implements IPaxTableService {
  constructor() {
    super(TrnPaxTableEntity)
  }

  /**
   * Search fields for PaxTable keyword search.
   */
  protected get searchFields(): string[] {
    return []
  }

  /**
   * Validates before creating a new PaxTable.
   */
  protected async validateCreate(data: DeepPartial<TrnPaxTableEntity>): Promise<void> {
    await transformAndValidate(CreatePaxTableDto, data)
  }

  /**
   * Validates before updating an existing PaxTable.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnPaxTableEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Pax Table entry not found for update.')
    }

    await transformAndValidate(UpdatePaxTableDto, data)
  }

  /**
   * Validates before deleting a PaxTable.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Pax Table entry not found for deletion.')
    }
  }
}
