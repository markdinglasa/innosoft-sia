import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnJournalEntity } from '../../../entities/transactions/TrnJournal.entity'
import { BaseService } from '../../base.service'
import { CreateJournalDto, UpdateJournalDto } from './dto'

/**
 * Interface defining the specific operations for the Journal service.
 */
export interface IJournalService {
  // Add any Journal-specific methods here if needed
}

/**
 * Service handling TrnJournalEntity CRUD and validations.
 */
export class JournalService extends BaseService<TrnJournalEntity> implements IJournalService {
  constructor() {
    super(TrnJournalEntity)
  }

  /**
   * Search fields for Journal keyword search.
   */
  protected get searchFields(): string[] {
    return ['journalRefDocument']
  }

  /**
   * Validates before creating a new Journal.
   */
  protected async validateCreate(data: DeepPartial<TrnJournalEntity>): Promise<void> {
    await transformAndValidate(CreateJournalDto, data)
  }

  /**
   * Validates before updating an existing Journal.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnJournalEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Journal not found for update.')
    }

    await transformAndValidate(UpdateJournalDto, data)
  }

  /**
   * Validates before deleting a Journal.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Journal not found for deletion.')
    }
  }
}
