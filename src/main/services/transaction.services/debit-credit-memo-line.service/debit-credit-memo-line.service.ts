import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnDebitCreditMemoLineEntity } from '../../../entities/transactions/TrnDebitCreditMemoLine.entity'
import { BaseService } from '../../base.service'
import { CreateDebitCreditMemoLineDto, UpdateDebitCreditMemoLineDto } from './dto'

/**
 * Interface defining the specific operations for the DebitCreditMemoLine service.
 */
export interface IDebitCreditMemoLineService {
  // Add any DebitCreditMemoLine-specific methods here if needed
}

/**
 * Service handling TrnDebitCreditMemoLineEntity CRUD and validations.
 */
export class DebitCreditMemoLineService extends BaseService<TrnDebitCreditMemoLineEntity> implements IDebitCreditMemoLineService {
  constructor() {
    super(TrnDebitCreditMemoLineEntity)
  }

  /**
   * Search fields for DebitCreditMemoLine keyword search.
   */
  protected get searchFields(): string[] {
    return ['particulars']
  }

  /**
   * Validates before creating a new DebitCreditMemoLine.
   */
  protected async validateCreate(data: DeepPartial<TrnDebitCreditMemoLineEntity>): Promise<void> {
    await transformAndValidate(CreateDebitCreditMemoLineDto, data)
  }

  /**
   * Validates before updating an existing DebitCreditMemoLine.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnDebitCreditMemoLineEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Debit/Credit Memo Line not found for update.')
    }

    await transformAndValidate(UpdateDebitCreditMemoLineDto, data)
  }

  /**
   * Validates before deleting a DebitCreditMemoLine.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Debit/Credit Memo Line not found for deletion.')
    }
  }
}
