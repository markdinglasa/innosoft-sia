import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstRoleEntity } from './MstRole.entity'
import { MstUserEntity } from './MstUser.entity'

@Entity(POSEntity.MST_USER_ROLES)
export class MstUserRolesEntity extends BaseEntity {
  constructor() {
    super()
    this.userId = 0
    this.roleId= 0
    this.user = undefined
    this.role = undefined
    this.isDefault = false
  }

  @Column({ name: 'UserId', type: 'int', nullable: false })
  userId: number

  // FK Relationships
  @ManyToOne(() => MstUserEntity, (user) => user.userRoles)
  @JoinColumn({ name: 'UserId' })
  user?: MstUserEntity

  @Column({ name: 'RoleId', type: 'int', nullable: false })
  roleId: number

    @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean

  @ManyToOne(() => MstRoleEntity, (role) => role.userRoles)
  @JoinColumn({ name: 'RoleId' })
  role?: MstRoleEntity
}

