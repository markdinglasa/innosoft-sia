import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnStockCountEntity } from '../../../entities/transactions/TrnStockCount.entity'
import { BaseService } from '../../base.service'
import { CreateStockCountDto, UpdateStockCountDto } from './dto'

/**
 * Interface defining the specific operations for the StockCount service.
 */
export interface IStockCountService {
  // Add any StockCount-specific methods here if needed
}

/**
 * Service handling TrnStockCountEntity CRUD and validations.
 */
export class StockCountService extends BaseService<TrnStockCountEntity> implements IStockCountService {
  constructor() {
    super(TrnStockCountEntity)
  }

  /**
   * Search fields for StockCount keyword search.
   */
  protected get searchFields(): string[] {
    return ['stockCountNumber', 'remarks']
  }

  /**
   * Validates before creating a new StockCount.
   */
  protected async validateCreate(data: DeepPartial<TrnStockCountEntity>): Promise<void> {
    const dto = await transformAndValidate(CreateStockCountDto, data)
    
    const existing = await this.repository.findOneBy({ stockCountNumber: dto.stockCountNumber })
    if (existing) {
      throw new BadRequestException(`Stock Count Number '${dto.stockCountNumber}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing StockCount.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnStockCountEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock Count not found for update.')
    }

    const dto = await transformAndValidate(UpdateStockCountDto, data)

    if (dto.stockCountNumber && dto.stockCountNumber !== current.stockCountNumber) {
      const existing = await this.repository.findOneBy({ stockCountNumber: dto.stockCountNumber })
      if (existing) {
        throw new BadRequestException(`Stock Count Number '${dto.stockCountNumber}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a StockCount.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Stock Count not found for deletion.')
    }
  }
}
