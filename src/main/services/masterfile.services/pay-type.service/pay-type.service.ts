import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstPayTypeEntity } from '../../../entities/masterfiles/MstPayType.entity'
import { BaseService } from '../../base.service'
import { CreatePayTypeDto, UpdatePayTypeDto } from './dto'

export interface IPayTypeService {
  // Add specific PayType methods here later
}

export class PayTypeService extends BaseService<MstPayTypeEntity> implements IPayTypeService {
  constructor() {
    super(MstPayTypeEntity)
  }

  /**
   * Search fields for PayType keyword search.
   */
  protected get searchFields(): string[] {
    return ['name']
  }

  /**
   * Validates before creating a new PayType.
   * Ensures PayType name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstPayTypeEntity>): Promise<void> {
    const payTypeDto = await transformAndValidate(CreatePayTypeDto, data)

    const existingName = await this.repository.findOneBy({ name: payTypeDto.name })
    if (existingName) {
      throw new BadRequestException(`Pay Type '${payTypeDto.name}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing PayType.
   */
  protected async validateUpdate(
    id: any,
    data: QueryDeepPartialEntity<MstPayTypeEntity>
  ): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Pay Type not found for update.')
    }

    const payTypeDto = await transformAndValidate(UpdatePayTypeDto, data)
    if (payTypeDto.name && payTypeDto.name !== currentEntity.name) {
      const existingName = await this.repository.findOneBy({ name: payTypeDto.name })
      if (existingName) {
        throw new BadRequestException(`Pay Type '${payTypeDto.name}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a PayType.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Pay Type not found for deletion.')
    }
  }
}

