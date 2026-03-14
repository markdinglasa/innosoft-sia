// CREATE TABLE [dbo].[MstPayType](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[PayType] [nvarchar](50) NOT NULL,
// 	[AccountId] [int] NULL,
// 	[SortNumber] [int] NULL,

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstAccountEntity } from './MstAccount.entity'

@Entity(POSEntity.MST_PAY_TYPE)
export class MstPayTypeEntity extends BaseEntity {
  constructor() {
    super()
    this.payType = 'NA'
    this.accountId = null
    this.sortNumber = null
  }

  @Column({ name: 'PayType', type: 'nvarchar', length: 50, nullable: false })
  payType: string

  @Column({ name: 'AccountId', type: 'int', nullable: true })
  accountId: number | null

  @Column({ name: 'SortNumber', type: 'int', nullable: true })
  sortNumber: number | null

  // FK Relationships
  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity
}
