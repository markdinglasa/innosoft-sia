import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnDebitCreditMemoEntity } from '../../../entities/transactions/TrnDebitCreditMemo.entity'
import { BaseService } from '../../base.service'
import { CreateDebitCreditMemoDto, UpdateDebitCreditMemoDto } from './dto'
import { Iso8583Parser } from '../../../utils/iso-8583-parser'

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
    return ['dcMemoNumber', 'particulars', 'terminalId', 'memoType']
  }

  /**
   * Validates before creating a new DebitCreditMemo.
   */
  protected async validateCreate(data: DeepPartial<TrnDebitCreditMemoEntity>): Promise<void> {
    const dto = await transformAndValidate(CreateDebitCreditMemoDto, data)
    
    // Check for existing memo number
    const existing = await this.repository.findOneBy({ dcMemoNumber: dto.dcMemoNumber })
    if (existing) {
      throw new BadRequestException(`Debit/Credit Memo Number '${dto.dcMemoNumber}' already exists.`)
    }

    // Business Rule: Amount validation (max $10,000)
    if (dto.amount > 10000) {
      throw new BadRequestException('Memo amount cannot exceed $10,000.')
    }

    // Business Rule: Requirement 2.2 - Manager authorization for amounts > $100
    // This is typically handled by the frontend passing an authorization flag or token.
    // For now, we validate the presence of such authorization if needed.
    if (dto.amount > 100 && !dto.authorizationCode) {
      throw new BadRequestException('Manager authorization is required for memos exceeding $100.')
    }

    // Business Rule: Requirement 1.2 - Reject future dates
    if (new Date(dto.dcMemoDate) > new Date()) {
      throw new BadRequestException('Memo date cannot be in the future.')
    }
  }

  /**
   * Processes an incoming ISO 8583 message and creates a memo record.
   */
  public async createFromIso8583(message: any, userId: number): Promise<void> {
    const parsedData = Iso8583Parser.parse(message)
    
    const payload: DeepPartial<TrnDebitCreditMemoEntity> = {
      ...parsedData,
      dcMemoNumber: `AUTO-${Date.now()}`,
      dcMemoDate: new Date(),
      preparedBy: userId,
      checkedBy: userId,
      approvedBy: userId // Auto-approved for card transactions
    }

    await this.create(payload, userId)
    
    await this.audit({
      userId,
      action: 'AUTO-LOG ISO8583',
      recordId: payload.dcMemoNumber,
      newData: payload
    })
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
