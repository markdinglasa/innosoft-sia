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

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { POSEntity } from '../entity-names'
import { SysUserTerminalEntity } from "../utilities/SysUserTerminal.entity"
import { MstBranchAccessEntity } from './MstBranchAccess.entity'
import { MstPermissionsEntity } from "./MstPermissions.entity"
import { MstUserRolesEntity } from './MstUserRoles.entity'

@Entity(POSEntity.MST_USER)
export class MstUserEntity {
  constructor() {
    this.type = 'Teller' // | 'Cashier' | 'Administrator'
    this.isLocked = false
    this.username = ''
    this.password = ''
    this.fullName = ''
    this.userCardNumber = null
    this.email = ''
    this.status = 'Active'
    this.image = null
    this.entryDateTime = new Date()
    this.isDefault = false
  }

    @PrimaryGeneratedColumn({ name: 'Id', type: 'int' })
    id!: number
  
    @Column({ name: 'IsLocked', type: 'bit' })
    isLocked: boolean

    @Column({ name: 'IsDefault', type: 'bit' })
    isDefault: boolean
  
    @CreateDateColumn({ name: 'EntryDateTime', type: 'datetimeoffset' })
    entryDateTime: Date

    @UpdateDateColumn({ name: 'UpdateDateTime', type: 'datetimeoffset', nullable: true })
    updateDateTime?: Date | null
  
 @Column({ name: 'Type', type: 'nvarchar', length: 50, nullable: false })
  type: string

  @Column({ name: 'UserName', type: 'nvarchar', length: 50, nullable: false })
  username: string

  @Column({ name: 'Password', type: 'text',  nullable: false })
  password: string

    @Column({ name: 'Email', type: 'nvarchar', length:255,  nullable: false })
  email: string

  @Column({ name: 'FullName', type: 'nvarchar', length: 255, nullable: false })
  fullName: string

  @Column({ name: 'UserCardNumber', type: 'nvarchar', length: 255, nullable: true })
  userCardNumber: string | null

  @Column({ name: 'Status', type: 'nvarchar', length: 50, nullable: false })
  status: string

  @Column({ name: 'Image', type: 'text', nullable: true })
  image: string | null

  // FK Relationships
  @OneToMany(() => MstUserRolesEntity, (userRole) => userRole.user)
  userRoles?: MstUserRolesEntity[]

  @OneToMany(() => MstBranchAccessEntity, (branchAccess) => branchAccess.user)
  branchAccesses?: MstBranchAccessEntity[]

  @OneToMany(() => SysUserTerminalEntity, (userTerminal) => userTerminal.user)
  userTerminals?: SysUserTerminalEntity[]

  // virtual fields
  permissions?: MstPermissionsEntity[]
}
