import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnStockInLineEntity } from '../../../entities/transactions/TrnStockInLine.entity'
import { BaseService } from '../../base.service'
import { CreateStockInLineDto, UpdateStockInLineDto } from './dto'

/**
 * Interface defining the specific operations for the StockInLine service.
 */
export interface IStockInLineService {
  // Add any StockInLine-specific methods here if needed
}

/**
 * Service handling TrnStockInLineEntity CRUD and validations.
 */
export class StockInLineService extends BaseService<TrnStockInLineEntity> implements IStockInLineService {
  constructor() {
    super(TrnStockInLineEntity)
  }

  /**
   * Search fields for StockInLine keyword search.
   */
  protected get searchFields(): string[] {
    return ['lotNumber']
  }

  /**
   * Validates before creating a new StockInLine.
   */
  protected async validateCreate(data: DeepPartial<TrnStockInLineEntity>): Promise<void> {
    await transformAndValidate(CreateStockInLineDto, data)
  }

  /**
   * Validates before updating an existing StockInLine.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnStockInLineEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock In Line not found for update.')
    }

    await transformAndValidate(UpdateStockInLineDto, data)
  }

  /**
   * Validates before deleting a StockInLine.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock In Line not found for deletion.')
    }
  }
}
