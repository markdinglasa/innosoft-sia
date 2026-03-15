import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnDisbursementEntity } from '../../../entities/transactions/TrnDisbursement.entity'
import { BaseService } from '../../base.service'
import { CreateDisbursementDto, UpdateDisbursementDto } from './dto'

/**
 * Interface defining the specific operations for the Disbursement service.
 */
export interface IDisbursementService {
  // Add any Disbursement-specific methods here if needed
}

/**
 * Service handling TrnDisbursementEntity CRUD and validations.
 */
export class DisbursementService extends BaseService<TrnDisbursementEntity> implements IDisbursementService {
  constructor() {
    super(TrnDisbursementEntity)
  }

  /**
   * Search fields for Disbursement keyword search.
   */
  protected get searchFields(): string[] {
    return ['disbursementNumber', 'disbursementType', 'remarks', 'payee']
  }

  /**
   * Validates before creating a new Disbursement.
   */
  protected async validateCreate(data: DeepPartial<TrnDisbursementEntity>): Promise<void> {
    const dto = await transformAndValidate(CreateDisbursementDto, data)
    
    const existing = await this.repository.findOneBy({ disbursementNumber: dto.disbursementNumber })
    if (existing) {
      throw new BadRequestException(`Disbursement Number '${dto.disbursementNumber}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Disbursement.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnDisbursementEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Disbursement not found for update.')
    }

    const dto = await transformAndValidate(UpdateDisbursementDto, data)

    if (dto.disbursementNumber && dto.disbursementNumber !== current.disbursementNumber) {
      const existing = await this.repository.findOneBy({ disbursementNumber: dto.disbursementNumber })
      if (existing) {
        throw new BadRequestException(`Disbursement Number '${dto.disbursementNumber}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Disbursement.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Disbursement not found for deletion.')
    }
  }
}
