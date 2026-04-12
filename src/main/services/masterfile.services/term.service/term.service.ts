import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstTermEntity } from '../../../entities/masterfiles/MstTerm.entity'
import { BaseService } from '../../base.service'
import { CreateTermDto, UpdateTermDto } from './dto'

export interface ITermService {
  // Add specific Term methods here later
}

export class TermService extends BaseService<MstTermEntity> implements ITermService {
  constructor() {
    super(MstTermEntity)
  }

  /**
   * Search fields for Term keyword search.
   */
  protected get searchFields(): string[] {
    return ['name']
  }

  /**
   * Validates before creating a new Term.
   * Ensures Term Name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstTermEntity>): Promise<void> {
    const termDto = await transformAndValidate(CreateTermDto, data)

    const existingName = await this.repository.findOneBy({ name: termDto.name })
    if (existingName) {
      throw new BadRequestException(`Term '${termDto.name}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Term.
   */
  protected async validateUpdate(
    id: any,
    data: QueryDeepPartialEntity<MstTermEntity>
  ): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Term not found for update.')
    }

    const termDto = await transformAndValidate(UpdateTermDto, data)
    if (termDto.name && termDto.name !== currentEntity.name) {
      const existingName = await this.repository.findOneBy({ name: termDto.name })
      if (existingName) {
        throw new BadRequestException(`Term '${termDto.name}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Term.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.repository.findOne({
      where: { id },
      relations: ['customers', 'suppliers', 'orders']
    })

    if (!currentEntity) {
      throw new BadRequestException('Term not found for deletion.')
    }

    if (currentEntity.isDefault) {
      throw new BadRequestException('Default term cannot be deleted.')
    }

    if (currentEntity.customers && currentEntity.customers.length > 0) {
      throw new BadRequestException('Cannot delete term because it is currently used by customers.')
    }

    if (currentEntity.suppliers && currentEntity.suppliers.length > 0) {
      throw new BadRequestException('Cannot delete term because it is currently used by suppliers.')
    }

    if (currentEntity.orders && currentEntity.orders.length > 0) {
      throw new BadRequestException('Cannot delete term because it is currently used in transactions.')
    }
  }
}

