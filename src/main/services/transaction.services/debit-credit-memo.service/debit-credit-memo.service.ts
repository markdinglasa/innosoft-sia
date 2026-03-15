import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnDebitCreditMemoEntity } from '../../../entities/transactions/TrnDebitCreditMemo.entity'
import { BaseService } from '../../base.service'
import { CreateDebitCreditMemoDto, UpdateDebitCreditMemoDto } from './dto'

/**
 * Interface defining the specific operations for the DebitCreditMemo service.
 */
export interface IDebitCreditMemoService {
  // Add any DebitCreditMemo-specific methods here if needed
}

/**
 * Service handling TrnDebitCreditMemoEntity CRUD and validations.
 */
export class DebitCreditMemoService extends BaseService<TrnDebitCreditMemoEntity> implements IDebitCreditMemoService {
  constructor() {
    super(TrnDebitCreditMemoEntity)
  }

  /**
   * Search fields for DebitCreditMemo keyword search.
   */
  protected get searchFields(): string[] {
    return ['dcMemoNumber', 'particulars']
  }

  /**
   * Validates before creating a new DebitCreditMemo.
   */
  protected async validateCreate(data: DeepPartial<TrnDebitCreditMemoEntity>): Promise<void> {
    const dto = await transformAndValidate(CreateDebitCreditMemoDto, data)
    
    const existing = await this.repository.findOneBy({ dcMemoNumber: dto.dcMemoNumber })
    if (existing) {
      throw new BadRequestException(`Debit/Credit Memo Number '${dto.dcMemoNumber}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing DebitCreditMemo.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnDebitCreditMemoEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Debit/Credit Memo not found for update.')
    }

    const dto = await transformAndValidate(UpdateDebitCreditMemoDto, data)

    if (dto.dcMemoNumber && dto.dcMemoNumber !== current.dcMemoNumber) {
      const existing = await this.repository.findOneBy({ dcMemoNumber: dto.dcMemoNumber })
      if (existing) {
        throw new BadRequestException(`Debit/Credit Memo Number '${dto.dcMemoNumber}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a DebitCreditMemo.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Debit/Credit Memo not found for deletion.')
    }
  }
}
