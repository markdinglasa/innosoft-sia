// CREATE TABLE [dbo].[MstTableGroup](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[TableGroup] [nvarchar](50) NOT NULL,
// 	[EntryUserId] [int] NOT NULL,
// 	[EntryDateTime] [datetime] NOT NULL,
// 	[UpdateUserId] [int] NOT NULL,
// 	[UpdateDateTime] [datetime] NOT NULL,
// 	[IsLocked] [bit] NOT NULL,

import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_TABLE_GROUP)
export class MstTableGroupEntity extends BaseEntity {
  constructor() {
    super()
    this.tableGroup = ''
    this.isDefault = false
    this.branchId = 0
  }

  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'TableGroup', type: 'nvarchar', length: 50, nullable: false })
  tableGroup: string

    @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean
}
