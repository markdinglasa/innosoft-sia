// CREATE TABLE [dbo].[MstPeriod](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Period] [nvarchar](50) NOT NULL,

import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_PERIOD)
export class MstPeriodEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.name = ''
    this.isDefault = false
  }

  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'Name', type: 'nvarchar', length: 50, nullable: false })
  name: string

  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean
}
