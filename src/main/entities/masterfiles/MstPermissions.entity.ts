import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstAccessRightEntity } from './MstAccessRight.entity'
import { MstRoleEntity } from './MstRole.entity'

@Entity(POSEntity.MST_PERMISSIONS)
export class MstPermissionsEntity extends BaseEntity {
  constructor() {
    super()
    this.accessRightId = 0
    this.roleId= 0
    this.accessRight = undefined
    this.role = undefined
  }

  @Column({ name: 'AccessRightId', type: 'int', nullable: false })
  accessRightId: number

  // FK Relationships
  @ManyToOne(() => MstAccessRightEntity, (accessRight) => accessRight.permissions)
  @JoinColumn({ name: 'AccessRightId' })
  accessRight?: MstAccessRightEntity

  @Column({ name: 'RoleId', type: 'int', nullable: false })
  roleId: number

  @ManyToOne(() => MstRoleEntity, (role) => role.permissions)
  @JoinColumn({ name: 'RoleId' })
  role?: MstRoleEntity

  // virtual fields

  action?:string
  @AfterLoad()
  set(){
    this.action = this.accessRight?.action
  }
}



