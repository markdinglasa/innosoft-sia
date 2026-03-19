// CREATE TABLE [dbo].[MstPeriod](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Period] [nvarchar](50) NOT NULL,

import { BaseEntity, Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.MST_PERIOD)
export class MstPeriodEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.period = ''
    this.isDefault = false
  }

  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'Period', type: 'nvarchar', length: 50, nullable: false })
  period: string

    @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean
}
