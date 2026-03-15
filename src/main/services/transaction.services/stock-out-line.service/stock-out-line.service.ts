import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnStockOutLineEntity } from '../../../entities/transactions/TrnStockOutLine.entity'
import { BaseService } from '../../base.service'
import { CreateStockOutLineDto, UpdateStockOutLineDto } from './dto'

/**
 * Interface defining the specific operations for the StockOutLine service.
 */
export interface IStockOutLineService {
  // Add any StockOutLine-specific methods here if needed
}

/**
 * Service handling TrnStockOutLineEntity CRUD and validations.
 */
export class StockOutLineService extends BaseService<TrnStockOutLineEntity> implements IStockOutLineService {
  constructor() {
    super(TrnStockOutLineEntity)
  }

  /**
   * Search fields for StockOutLine keyword search.
   */
  protected get searchFields(): string[] {
    return []
  }

  /**
   * Validates before creating a new StockOutLine.
   */
  protected async validateCreate(data: DeepPartial<TrnStockOutLineEntity>): Promise<void> {
    await transformAndValidate(CreateStockOutLineDto, data)
  }

  /**
   * Validates before updating an existing StockOutLine.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnStockOutLineEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock Out Line not found for update.')
    }

    await transformAndValidate(UpdateStockOutLineDto, data)
  }

  /**
   * Validates before deleting a StockOutLine.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock Out Line not found for deletion.')
    }
  }
}
