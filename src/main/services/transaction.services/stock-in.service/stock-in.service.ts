import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnStockInEntity } from '../../../entities/transactions/TrnStockIn.entity'
import { BaseService } from '../../base.service'
import { CreateStockInDto, UpdateStockInDto } from './dto'

/**
 * Interface defining the specific operations for the StockIn service.
 */
export interface IStockInService {
  // Add any StockIn-specific methods here if needed
}

/**
 * Service handling TrnStockInEntity CRUD and validations.
 */
export class StockInService extends BaseService<TrnStockInEntity> implements IStockInService {
  constructor() {
    super(TrnStockInEntity)
  }

  /**
   * Search fields for StockIn keyword search.
   */
  protected get searchFields(): string[] {
    return ['stockInNumber', 'remarks']
  }

  /**
   * Validates before creating a new StockIn.
   */
  protected async validateCreate(data: DeepPartial<TrnStockInEntity>): Promise<void> {
    const dto = await transformAndValidate(CreateStockInDto, data)
    
    const existing = await this.repository.findOneBy({ stockInNumber: dto.stockInNumber })
    if (existing) {
      throw new BadRequestException(`Stock In Number '${dto.stockInNumber}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing StockIn.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnStockInEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock In not found for update.')
    }

    const dto = await transformAndValidate(UpdateStockInDto, data)

    if (dto.stockInNumber && dto.stockInNumber !== current.stockInNumber) {
      const existing = await this.repository.findOneBy({ stockInNumber: dto.stockInNumber })
      if (existing) {
        throw new BadRequestException(`Stock In Number '${dto.stockInNumber}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a StockIn.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock In not found for deletion.')
    }
  }
}
