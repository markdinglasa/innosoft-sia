// CREATE TABLE [dbo].[MstUserForm](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[FormId] [int] NOT NULL,
// 	[UserId] [int] NOT NULL,
// 	[CanDelete] [bit] NOT NULL,
// 	[CanAdd] [bit] NOT NULL,
// 	[CanLock] [bit] NOT NULL,
// 	[CanUnlock] [bit] NOT NULL,
// 	[CanPrint] [bit] NOT NULL,
// 	[CanPreview] [bit] NOT NULL,
// 	[CanEdit] [bit] NOT NULL,
// 	[CanTender] [bit] NOT NULL,
// 	[CanDiscount] [bit] NOT NULL,
// 	[CanView] [bit] NOT NULL,
// 	[CanSplit] [bit] NOT NULL,
// 	[CanCancel] [bit] NOT NULL,
// 	[CanReturn] [bit] NOT NULL,

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.MST_USER_FORM)
export class MstUserFormEntity {
  constructor() {
    this.id = 0
    this.formId = 0
    this.userId = 0
    this.canDelete = false
    this.canAdd = false
    this.canLock = false
    this.canUnlock = false
    this.canPrint = false
    this.canPreview = false
    this.canEdit = false
    this.canTender = false
    this.canDiscount = false
    this.canView = false
    this.canSplit = false
    this.canCancel = false
    this.canReturn = false
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'FormId', type: 'int', nullable: false })
  formId: number

  @Column({ name: 'UserId', type: 'int', nullable: false })
  userId: number

  @Column({ name: 'CanDelete', type: 'bit', nullable: false })
  canDelete: boolean

  @Column({ name: 'CanAdd', type: 'bit', nullable: false })
  canAdd: boolean

  @Column({ name: 'CanLock', type: 'bit', nullable: false })
  canLock: boolean

  @Column({ name: 'CanUnlock', type: 'bit', nullable: false })
  canUnlock: boolean

  @Column({ name: 'CanPrint', type: 'bit', nullable: false })
  canPrint: boolean

  @Column({ name: 'CanPreview', type: 'bit', nullable: false })
  canPreview: boolean

  @Column({ name: 'CanEdit', type: 'bit', nullable: false })
  canEdit: boolean

  @Column({ name: 'CanTender', type: 'bit', nullable: false })
  canTender: boolean

  @Column({ name: 'CanDiscount', type: 'bit', nullable: false })
  canDiscount: boolean

  @Column({ name: 'CanView', type: 'bit', nullable: false })
  canView: boolean

  @Column({ name: 'CanSplit', type: 'bit', nullable: false })
  canSplit: boolean

  @Column({ name: 'CanCancel', type: 'bit', nullable: false })
  canCancel: boolean

  @Column({ name: 'CanReturn', type: 'bit', nullable: false })
  canReturn: boolean
}
