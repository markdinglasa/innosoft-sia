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
    return ['code', 'tax']
  }

  /**
   * Validates before creating a new Tax.
   * Ensures Tax Code and Name are unique.
   */
  protected async validateCreate(data: DeepPartial<MstTaxEntity>): Promise<void> {
    const taxDto = await transformAndValidate(CreateTaxDto, data)

    const existingCode = await this.repository.findOneBy({ code: taxDto.code })
    if (existingCode) {
      throw new BadRequestException(`Tax Code '${taxDto.code}' already exists.`)
    }

    const existingName = await this.repository.findOneBy({ tax: taxDto.tax })
    if (existingName) {
      throw new BadRequestException(`Tax Name '${taxDto.tax}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Tax.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstTaxEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Tax not found for update.')
    }

    const taxDto = await transformAndValidate(UpdateTaxDto, data)
    
    if (taxDto.code && taxDto.code !== currentEntity.code) {
      const existingCode = await this.repository.findOneBy({ code: taxDto.code })
      if (existingCode) {
        throw new BadRequestException(`Tax Code '${taxDto.code}' already exists.`)
      }
    }

    if (taxDto.tax && taxDto.tax !== currentEntity.tax) {
      const existingName = await this.repository.findOneBy({ tax: taxDto.tax })
      if (existingName) {
        throw new BadRequestException(`Tax Name '${taxDto.tax}' already exists.`)
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
  }
}
