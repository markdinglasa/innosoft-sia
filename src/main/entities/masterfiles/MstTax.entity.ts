// CREATE TABLE [dbo].[MstTax](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Code] [nvarchar](50) NOT NULL,
// 	[Tax] [nvarchar](50) NOT NULL,
// 	[Rate] [decimal](18, 5) NOT NULL,
// 	[AccountId] [int] NOT NULL,

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'
import { MstAccountEntity } from './MstAccount.entity'

@Entity(POSEntity.MST_TAX)
export class MstTaxEntity {
  constructor() {
    this.id = 0
    this.code = ''
    this.tax = ''
    this.rate = 0
    this.accountId = 0
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'Code', type: 'nvarchar', length: 50, nullable: false })
  code: string

  @Column({ name: 'Tax', type: 'nvarchar', length: 50, nullable: false })
  tax: string

  @Column({ name: 'Rate', type: 'decimal', precision: 18, scale: 5, nullable: false })
  rate: number

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

  // FK Relationships
  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity
}
