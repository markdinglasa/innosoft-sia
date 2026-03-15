import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstBranchAccessEntity } from '../../../entities/masterfiles/MstBranchAccess.entity'
import { BaseService } from '../../base.service'
import { CreateBranchAccessDto, UpdateBranchAccessDto } from './dto'

export interface IBranchAccessService {
  // Add specific BranchAccess methods here later
}

export class BranchAccessService extends BaseService<MstBranchAccessEntity> implements IBranchAccessService {
  constructor() {
    super(MstBranchAccessEntity)
  }

  /**
   * Search fields for BranchAccess keyword search.
   * Since it's a link table, search is less common, but we can search by related IDs.
   */
  protected get searchFields(): string[] {
    return ['branchId', 'userId']
  }

  /**
   * Validates before creating a new BranchAccess.
   * Ensures the branch-user combination is unique.
   */
  protected async validateCreate(data: DeepPartial<MstBranchAccessEntity>): Promise<void> {
    const accessDto = await transformAndValidate(CreateBranchAccessDto, data)

    const existingAccess = await this.repository.findOneBy({ 
      branchId: accessDto.branchId,
      userId: accessDto.userId
    })
    
    if (existingAccess) {
      throw new BadRequestException('This user already has access to this branch.')
    }
  }

  /**
   * Validates before updating an existing BranchAccess.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstBranchAccessEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Branch Access not found for update.')
    }

    const accessDto = await transformAndValidate(UpdateBranchAccessDto, data)
    
    const branchId = accessDto.branchId ?? currentEntity.branchId
    const userId = accessDto.userId ?? currentEntity.userId

    if (branchId !== currentEntity.branchId || userId !== currentEntity.userId) {
      const existingAccess = await this.repository.findOneBy({ 
        branchId,
        userId
      })
      
      if (existingAccess) {
        throw new BadRequestException('This user already has access to this branch.')
      }
    }
  }

  /**
   * Validates before deleting a BranchAccess.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Branch Access not found for deletion.')
    }
  }
}
