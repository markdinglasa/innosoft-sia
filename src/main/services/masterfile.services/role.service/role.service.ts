import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstPermissionsEntity } from '../../../entities/masterfiles/MstPermissions.entity'
import { MstRoleEntity } from '../../../entities/masterfiles/MstRole.entity'
import { ParentChildService } from '../../parent-child.service'
import { CreateRoleDto, UpdateRoleDto } from './dto'

export interface IRoleService {
  // Add specific Role methods here later
}

export class RoleService extends ParentChildService<MstRoleEntity> implements IRoleService {
  constructor() {
    super(MstRoleEntity, [
      { entity: MstPermissionsEntity, foreignKey: 'roleId', payloadKey: 'permissions' }
    ])
  }



  /**
   * Search fields for Role keyword search.
   */
  protected get searchFields(): string[] {
    return ['code', 'name', 'description']
  }

  /**
   * Validates before creating a new Role.
   * Ensures Role Code and Name are unique.
   */
  protected async validateCreate(data: DeepPartial<MstRoleEntity>): Promise<void> {
    const roleDto = await transformAndValidate(CreateRoleDto, data)

    const existingCode = await this.repository.findOneBy({ code: roleDto.code })
    if (existingCode) {
      throw new BadRequestException(`Role Code '${roleDto.code}' already exists.`)
    }

    const existingName = await this.repository.findOneBy({ name: roleDto.name })
    if (existingName) {
      throw new BadRequestException(`Role Name '${roleDto.name}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Role.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstRoleEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Role not found for update.')
    }

    const roleDto = await transformAndValidate(UpdateRoleDto, data)
    
    if (roleDto.code && roleDto.code !== currentEntity.code) {
      const existingCode = await this.repository.findOneBy({ code: roleDto.code })
      if (existingCode) {
        throw new BadRequestException(`Role Code '${roleDto.code}' already exists.`)
      }
    }

    if (roleDto.name && roleDto.name !== currentEntity.name) {
      const existingName = await this.repository.findOneBy({ name: roleDto.name })
      if (existingName) {
        throw new BadRequestException(`Role Name '${roleDto.name}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Role.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Role not found for deletion.')
    }
  }
}
