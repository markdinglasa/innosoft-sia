import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstPermissionsEntity } from '../../../entities/masterfiles/MstPermissions.entity'
import { BaseService } from '../../base.service'
import { CreatePermissionDto, UpdatePermissionDto } from './dto'

export interface IPermissionService {
  // Add specific Permission methods here later
}

export class PermissionService extends BaseService<MstPermissionsEntity> implements IPermissionService {
  constructor() {
    super(MstPermissionsEntity)
  }

  /**
   * Search fields for Permission keyword search.
   * Search by role or access right IDs.
   */
  protected get searchFields(): string[] {
    return ['roleId', 'accessRightId']
  }

  /**
   * Validates before creating a new Permission.
   * Ensures the role-accessRight combination is unique.
   */
  protected async validateCreate(data: DeepPartial<MstPermissionsEntity>): Promise<void> {
    const permissionDto = await transformAndValidate(CreatePermissionDto, data)

    const existingPermission = await this.repository.findOneBy({ 
      roleId: permissionDto.roleId,
      accessRightId: permissionDto.accessRightId
    })
    
    if (existingPermission) {
      throw new BadRequestException('This access right is already assigned to this role.')
    }
  }

  /**
   * Validates before updating an existing Permission.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstPermissionsEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Permission not found for update.')
    }

    const permissionDto = await transformAndValidate(UpdatePermissionDto, data)
    
    const roleId = permissionDto.roleId ?? currentEntity.roleId
    const accessRightId = permissionDto.accessRightId ?? currentEntity.accessRightId

    if (roleId !== currentEntity.roleId || accessRightId !== currentEntity.accessRightId) {
      const existingPermission = await this.repository.findOneBy({ 
        roleId,
        accessRightId
      })
      
      if (existingPermission) {
        throw new BadRequestException('This access right is already assigned to this role.')
      }
    }
  }

  /**
   * Validates before deleting a Permission.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Permission not found for deletion.')
    }
  }
}
