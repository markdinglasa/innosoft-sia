import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstAccountEntity } from '../../../entities/masterfiles/MstAccount.entity'
import { BaseService } from '../../base.service'
import { CreateAccountDto, UpdateAccountDto } from './dto'

export interface IAccountService {
  // Add specific Account methods here later
}

export class AccountService extends BaseService<MstAccountEntity> implements IAccountService {
  constructor() {
    super(MstAccountEntity)
  }

  /**
   * Search fields for Account keyword search.
   */
  protected get searchFields(): string[] {
    return ['code', 'account', 'accountType']
  }

  /**
   * Validates before creating a new Account.
   * Ensures Account Code is unique.
   */
  protected async validateCreate(data: DeepPartial<MstAccountEntity>): Promise<void> {
    const accountDto = await transformAndValidate(CreateAccountDto, data)

    const existingCode = await this.repository.findOneBy({ code: accountDto.code })
    if (existingCode) {
      throw new BadRequestException(`Account Code '${accountDto.code}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Account.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstAccountEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Account not found for update.')
    }

    const accountDto = await transformAndValidate(UpdateAccountDto, data)
    if (accountDto.code && accountDto.code !== currentEntity.code) {
      const existingCode = await this.repository.findOneBy({ code: accountDto.code })
      if (existingCode) {
        throw new BadRequestException(`Account Code '${accountDto.code}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting an Account.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Account not found for deletion.')
    }
  }
}
