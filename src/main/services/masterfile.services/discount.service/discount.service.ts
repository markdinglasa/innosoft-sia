import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstDiscountEntity } from '../../../entities/masterfiles/MstDiscount.entity'
import { BaseService } from '../../base.service'
import { CreateDiscountDto, UpdateDiscountDto } from './dto'

export interface IDiscountService {
  // Add specific Discount methods here later
}

export class DiscountService extends BaseService<MstDiscountEntity> implements IDiscountService {
  constructor() {
    super(MstDiscountEntity)
  }

  /**
   * Search fields for Discount keyword search.
   */
  protected get searchFields(): string[] {
    return ['name', 'discountAlias']
  }

  /**
   * Validates before creating a new Discount.
   * Ensures Discount Name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstDiscountEntity>): Promise<void> {
    const discountDto = await transformAndValidate(CreateDiscountDto, data)

    const existingName = await this.repository.findOneBy({ name: discountDto.name })
    if (existingName) {
      throw new BadRequestException(`Discount '${discountDto.name}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Discount.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstDiscountEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Discount not found for update.')
    }

    const discountDto = await transformAndValidate(UpdateDiscountDto, data)
    if (discountDto.name && discountDto.name !== currentEntity.name) {
      const existingName = await this.repository.findOneBy({ name: discountDto.name })
      if (existingName) {
        throw new BadRequestException(`Discount '${discountDto.name}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Discount.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Discount not found for deletion.')
    }
  }
}
