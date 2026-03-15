import { Column, Entity, OneToMany } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstUserRolesEntity } from './MstUserRoles.entity'
import { MstPermissionsEntity } from './MstPermissions.entity'

@Entity(POSEntity.MST_ROLE)
export class MstRoleEntity extends BaseEntity {
  constructor() {
    super()
    this.code = ''
    this.name = ''  
    this.description = null
    this.isDefault = false
    this.userRoles = []
    this.permissions = []
  }

  @Column({ name: 'Code ', type: 'nvarchar', length: 255, nullable: false })
  code: string

  @Column({ name: 'Name', type: 'nvarchar', length: 255, nullable: false })
  name: string  

  @Column({ name: 'Description', type: 'text', nullable: true })
  description: string | null

  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean

  // FK Relationships
  @OneToMany(() => MstUserRolesEntity, (userRole) => userRole.role)
  userRoles: MstUserRolesEntity[]

  @OneToMany(() => MstPermissionsEntity, (permission) => permission.role)
  permissions: MstPermissionsEntity[]
}
