import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstDiscountEntity } from '../../../entities/masterfiles/MstDiscount.entity'
import { MstDiscountItemEntity } from '../../../entities/masterfiles/MstDiscountItem.entity'
import { ParentChildService } from '../../parent-child.service'
import { CreateDiscountDto, UpdateDiscountDto } from './dto'

export interface IDiscountService {
  // Add specific Discount methods here later
}

export class DiscountService
  extends ParentChildService<MstDiscountEntity>
  implements IDiscountService
{
  constructor() {
    super(MstDiscountEntity, [
      {
        entity: MstDiscountItemEntity,
        foreignKey: 'discountId',
        payloadKey: 'discountItems'
      }
    ])
  }

  /**
   * Search fields for Discount keyword search.
   */
  protected get searchFields(): string[] {
    return ['name', 'discountAlias']
  }

  /**
   * Relations to include in fetch results.
   */
  protected get listRelations(): string[] {
    return ['discountItems']
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
  protected async validateUpdate(
    id: number,
    data: QueryDeepPartialEntity<MstDiscountEntity>
  ): Promise<void> {
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
  protected async validateDelete(id: number): Promise<void> {
    const currentEntity = await this.repository.findOne({
      where: { id },
      withDeleted: false,
      relations: []
    })
    if (!currentEntity) {
      throw new BadRequestException('Discount not found for deletion.')
    }

    if (currentEntity.isDefault) {
      throw new BadRequestException('Default discount cannot be deleted.')
    }
  }
}

