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
    return ['name', 'code', 'type']
  }

  /**
   * Validates before creating a new Account.
   * Ensures Account account is unique.
   */
  protected async validateCreate(data: DeepPartial<MstAccountEntity>): Promise<void> {
    const accountDto = await transformAndValidate(CreateAccountDto, data)

    const existingaccount = await this.repository.findOneBy({ name: accountDto.name })
    if (existingaccount) {
      throw new BadRequestException(`Account name '${accountDto.name}' already exists.`)
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
    if (accountDto.name && accountDto.name !== currentEntity.name) {
      const existingaccount = await this.repository.findOneBy({ name: accountDto.name })
      if (existingaccount) {
        throw new BadRequestException(`Account name '${accountDto.name}' already exists.`)
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
