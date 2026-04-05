// CREATE TABLE [dbo].[MstSupplier](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Supplier] [nvarchar](100) NOT NULL,
// 	[Address] [nvarchar](255) NOT NULL,
// 	[TelephoneNumber] [nvarchar](50) NOT NULL,
// 	[CellphoneNumber] [nvarchar](50) NOT NULL,
// 	[FaxNumber] [nvarchar](50) NOT NULL,
// 	[TermId] [int] NOT NULL,
// 	[TIN] [nvarchar](50) NOT NULL,
// 	[AccountId] [int] NOT NULL,
// 	[EntryUserId] [int] NOT NULL,
// 	[EntryDateTime] [datetime] NOT NULL,
// 	[UpdateUserId] [int] NOT NULL,
// 	[UpdateDateTime] [datetime] NOT NULL,
// 	[IsLocked] [bit] NOT NULL,

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstAccountEntity } from './MstAccount.entity'
import { MstTermEntity } from './MstTerm.entity'

@Entity(POSEntity.MST_SUPPLIER)
export class MstSupplierEntity extends BaseEntity {
  constructor() {
    super()
    this.name = ''
    this.address = ''
    this.telephoneNumber = ''
    this.cellphoneNumber = ''
    this.faxNumber = ''
    this.termId = 0
    this.tin = ''
    this.accountId = 0
    this.isDefault = false
  }

  @Column({ name: 'Name', type: 'nvarchar', length: 100, nullable: false })
  name: string

  @Column({ name: 'Address', type: 'nvarchar', length: 255, nullable: false })
  address: string

  @Column({ name: 'TelephoneNumber', type: 'nvarchar', length: 50, nullable: false })
  telephoneNumber: string

  @Column({ name: 'CellphoneNumber', type: 'nvarchar', length: 50, nullable: false })
  cellphoneNumber: string

  @Column({ name: 'FaxNumber', type: 'nvarchar', length: 50, nullable: false })
  faxNumber: string

  @Column({ name: 'TermId', type: 'int', nullable: false })
  termId: number

  @Column({ name: 'TIN', type: 'nvarchar', length: 50, nullable: false })
  tin: string

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean

  // FK Relationships
  @ManyToOne(() => MstTermEntity)
  @JoinColumn({ name: 'TermId' })
  term?: MstTermEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity
}

