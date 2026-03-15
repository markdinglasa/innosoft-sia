import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnStockOutEntity } from '../../../entities/transactions/TrnStockOut.entity'
import { BaseService } from '../../base.service'
import { CreateStockOutDto, UpdateStockOutDto } from './dto'

/**
 * Interface defining the specific operations for the StockOut service.
 */
export interface IStockOutService {
  // Add any StockOut-specific methods here if needed
}

/**
 * Service handling TrnStockOutEntity CRUD and validations.
 */
export class StockOutService extends BaseService<TrnStockOutEntity> implements IStockOutService {
  constructor() {
    super(TrnStockOutEntity)
  }

  /**
   * Search fields for StockOut keyword search.
   */
  protected get searchFields(): string[] {
    return ['stockOutNumber', 'remarks']
  }

  /**
   * Validates before creating a new StockOut.
   */
  protected async validateCreate(data: DeepPartial<TrnStockOutEntity>): Promise<void> {
    const dto = await transformAndValidate(CreateStockOutDto, data)
    
    const existing = await this.repository.findOneBy({ stockOutNumber: dto.stockOutNumber })
    if (existing) {
      throw new BadRequestException(`Stock Out Number '${dto.stockOutNumber}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing StockOut.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnStockOutEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock Out not found for update.')
    }

    const dto = await transformAndValidate(UpdateStockOutDto, data)

    if (dto.stockOutNumber && dto.stockOutNumber !== current.stockOutNumber) {
      const existing = await this.repository.findOneBy({ stockOutNumber: dto.stockOutNumber })
      if (existing) {
        throw new BadRequestException(`Stock Out Number '${dto.stockOutNumber}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a StockOut.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock Out not found for deletion.')
    }
  }
}
