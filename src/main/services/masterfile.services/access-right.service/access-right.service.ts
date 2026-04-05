import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstAccessRightEntity } from '../../../entities/masterfiles/MstAccessRight.entity'
import { BaseService } from '../../base.service'
import { CreateAccessRightDto, UpdateAccessRightDto } from './dto'

export class AccessRightService extends BaseService<MstAccessRightEntity> {
  constructor() {
    super(MstAccessRightEntity)
  }

  protected get searchFields(): string[] {
    return ['action', 'category']
  }

  protected async validateCreate(data: DeepPartial<MstAccessRightEntity>): Promise<void> {
    const dto = await transformAndValidate(CreateAccessRightDto, data)
    
    // Uniqueness check for action + category
    const existing = await this.repository.findOneBy({ 
      action: dto.action,
      category: dto.category
    })
    
    if (existing) {
      throw new BadRequestException('This access right action already exists in this category.')
    }
  }

  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstAccessRightEntity>): Promise<void> {
     const current = await this.get(id)
     if (!current) throw new BadRequestException('Access Right not found.')

     const dto = await transformAndValidate(UpdateAccessRightDto, data)
     const action = dto.action ?? current.action
     const category = dto.category ?? current.category

     if (action !== current.action || category !== current.category) {
       const existing = await this.repository.findOneBy({ action, category })
       if (existing) {
         throw new BadRequestException('Another access right with this action and category already exists.')
       }
     }
  }
}
