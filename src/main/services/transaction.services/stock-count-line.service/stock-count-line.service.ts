import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnStockCountLineEntity } from '../../../entities/transactions/TrnStockCountLine.entity'
import { BaseService } from '../../base.service'
import { CreateStockCountLineDto, UpdateStockCountLineDto } from './dto'

/**
 * Interface defining the specific operations for the StockCountLine service.
 */
export interface IStockCountLineService {
  // Add any StockCountLine-specific methods here if needed
}

/**
 * Service handling TrnStockCountLineEntity CRUD and validations.
 */
export class StockCountLineService extends BaseService<TrnStockCountLineEntity> implements IStockCountLineService {
  constructor() {
    super(TrnStockCountLineEntity)
  }

  /**
   * Search fields for StockCountLine keyword search.
   */
  protected get searchFields(): string[] {
    return []
  }

  /**
   * Validates before creating a new StockCountLine.
   */
  protected async validateCreate(data: DeepPartial<TrnStockCountLineEntity>): Promise<void> {
    await transformAndValidate(CreateStockCountLineDto, data)
  }

  /**
   * Validates before updating an existing StockCountLine.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnStockCountLineEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock Count Line not found for update.')
    }

    await transformAndValidate(UpdateStockCountLineDto, data)
  }

  /**
   * Validates before deleting a StockCountLine.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock Count Line not found for deletion.')
    }
  }
}
