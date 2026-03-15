// CREATE TABLE [dbo].[MstUser](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[UserName] [nvarchar](50) NOT NULL,
// 	[Password] [nvarchar](50) NOT NULL,
// 	[FullName] [nvarchar](255) NOT NULL,
// 	[UserCardNumber] [nvarchar](255) NULL,
// 	[EntryUserId] [int] NOT NULL,
// 	[EntryDateTime] [datetime] NOT NULL,
// 	[UpdateUserId] [int] NOT NULL,
// 	[UpdateDateTime] [datetime] NOT NULL,
// 	[IsLocked] [bit] NOT NULL,
// 	[Role] [nvarchar](50) NULL,

import { Column, Entity, OneToMany } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstBranchAccessEntity } from './MstBranchAccess.entity'
import { MstPermissionsEntity } from "./MstPermissions.entity"
import { MstUserRolesEntity } from './MstUserRoles.entity'

@Entity(POSEntity.MST_USER)
export class MstUserEntity extends BaseEntity {
  constructor() {
    super()
    this.userName = ''
    this.password = ''
    this.fullName = ''
    this.userCardNumber = null
    this.email = ''
    this.userRoles = []
    this.branchAccesses = []
    this.status = 'Active'
    this.image = null
  }

  @Column({ name: 'UserName', type: 'nvarchar', length: 50, nullable: false })
  userName: string

  @Column({ name: 'Password', type: 'text',  nullable: false })
  password: string

    @Column({ name: 'Email', type: 'nvarchar', length:255,  nullable: false })
  email: string

  @Column({ name: 'FullName', type: 'nvarchar', length: 255, nullable: false })
  fullName: string

  @Column({ name: 'UserCardNumber', type: 'nvarchar', length: 255, nullable: true })
  userCardNumber: string | null

  @Column({ name: 'Status', type: 'enum', enum: ['Active','Suspended','Deactivated','Terminated'], nullable: false })
  status: string

  @Column({ name: 'Image', type: 'text', nullable: true })
  image: string | null

  // FK Relationships
  @OneToMany(() => MstUserRolesEntity, (userRole) => userRole.user)
  userRoles?: MstUserRolesEntity[]

  @OneToMany(() => MstBranchAccessEntity, (branchAccess) => branchAccess.user)
  branchAccesses?: MstBranchAccessEntity[]

  // virtual fields
  permissions?: MstPermissionsEntity[]
}
