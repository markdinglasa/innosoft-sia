import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstTaxEntity } from '../../../entities/masterfiles/MstTax.entity'
import { BaseService } from '../../base.service'
import { CreateTaxDto, UpdateTaxDto } from './dto'

export interface ITaxService {
  // Add specific Tax methods here later
}

export class TaxService extends BaseService<MstTaxEntity> implements ITaxService {
  constructor() {
    super(MstTaxEntity)
  }

  /**
   * Search fields for Tax keyword search.
   */
  protected get searchFields(): string[] {
    return ['code', 'name']
  }

  /**
   * Relations to include in Tax listing.
   */
  protected get listRelations(): string[] {
    return ['account']
  }

  /**
   * Validates before creating a new Tax.
   * Ensures Tax Code and Name are unique.
   */
  protected async validateCreate(data: DeepPartial<MstTaxEntity>): Promise<void> {
    const taxDto = await transformAndValidate(CreateTaxDto, data)

    const existingName = await this.repository.findOneBy({ name: taxDto.name })
    if (existingName) {
      throw new BadRequestException(`Tax Name '${taxDto.name}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Tax.
   */
  protected async validateUpdate(
    id: any,
    data: QueryDeepPartialEntity<MstTaxEntity>
  ): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Tax not found for update.')
    }

    const taxDto = await transformAndValidate(UpdateTaxDto, data)

    if (taxDto.name && taxDto.name !== currentEntity.name) {
      const existingName = await this.repository.findOneBy({ name: taxDto.name })
      if (existingName) {
        throw new BadRequestException(`Tax Name '${taxDto.name}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Tax.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Tax not found for deletion.')
    }

    if (currentEntity.isDefault) {
      throw new BadRequestException('Tax is default and cannot be deleted.')
    }
  }
}

