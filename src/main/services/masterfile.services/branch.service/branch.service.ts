import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstBranchEntity } from '../../../entities/masterfiles/MstBranch.entity'
import { BaseService } from '../../base.service'
import { CreateBranchDto, UpdateBranchDto } from './dto'

export interface IBranchService {
  // Add specific Branch methods here later
}

export class BranchService extends BaseService<MstBranchEntity> implements IBranchService {
  constructor() {
    super(MstBranchEntity)
  }

  /**
   * Search fields for Branch keyword search.
   */
  protected get searchFields(): string[] {
    return ['name', 'address', 'description']
  }

  /**
   * Validates before creating a new Branch.
   * Ensures Branch Name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstBranchEntity>): Promise<void> {
    const branchDto = await transformAndValidate(CreateBranchDto, data)

    const existingName = await this.repository.findOneBy({ name: branchDto.name })
    if (existingName) {
      throw new BadRequestException(`Branch '${branchDto.name}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Branch.
   */
  protected async validateUpdate(
    id: number,
    data: QueryDeepPartialEntity<MstBranchEntity>
  ): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Branch not found for update.')
    }

    const branchDto = await transformAndValidate(UpdateBranchDto, data)
    if (branchDto.name && branchDto.name !== currentEntity.name) {
      const existingName = await this.repository.findOneBy({ name: branchDto.name })
      if (existingName) {
        throw new BadRequestException(`Branch '${branchDto.name}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Branch.
   */
  protected async validateDelete(id: number): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Branch not found for deletion.')
    }

    if (currentEntity.isDefault) {
      throw new BadRequestException('Cannot delete default branch.')
    }

    // valudate if currently in-used
    const branch = await this.repository.findOne({
      where: {
        id: id
      },
      withDeleted: false,
      relations: ['branchAccesses']
    })

    if (branch?.branchAccesses && branch?.branchAccesses?.length > 0) {
      throw new BadRequestException('Cannot delete branch that is currently in-use.')
    }
  }
}

