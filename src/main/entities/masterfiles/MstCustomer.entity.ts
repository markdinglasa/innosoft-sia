// CREATE TABLE [dbo].[MstCustomer](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Customer] [nvarchar](50) NOT NULL,
// 	[Address] [nvarchar](255) NOT NULL,
// 	[ContactPerson] [nvarchar](50) NOT NULL,
// 	[ContactNumber] [nvarchar](50) NOT NULL,
// 	[CreditLimit] [decimal](18, 5) NOT NULL,
// 	[TermId] [int] NOT NULL,
// 	[TIN] [nvarchar](50) NOT NULL,
// 	[WithReward] [bit] NOT NULL,
// 	[RewardNumber] [nvarchar](50) NULL,
// 	[RewardConversion] [decimal](18, 5) NOT NULL,
// 	[AccountId] [int] NOT NULL,
// 	[EntryUserId] [int] NOT NULL,
// 	[EntryDateTime] [datetime] NOT NULL,
// 	[UpdateUserId] [int] NOT NULL,
// 	[UpdateDateTime] [datetime] NOT NULL,
// 	[IsLocked] [bit] NOT NULL,
// 	[DefaultPriceDescription] [nvarchar](255) NULL,
// 	[CustomerCode] [nvarchar](50) NULL,
// 	[BusinessStyle] [nvarchar](max) NULL,

import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_CUSTOMER)
export class MstCustomerEntity extends BaseEntity {
  constructor() {
    super()
    this.customer = ''
    this.address = ''
    this.contactPerson = ''
    this.contactNumber = ''
    this.creditLimit = 0
    this.termId = 0
    this.tin = ''
    this.withReward = false
    this.rewardNumber = null
    this.rewardConversion = 0
    this.accountId = 0
    this.defaultPriceDescription = null
    this.customerCode = null
    this.businessStyle = null
  }

  @Column({ name: 'Customer', type: 'nvarchar', length: 50, nullable: false })
  customer: string

  @Column({ name: 'Address', type: 'nvarchar', length: 255, nullable: false })
  address: string

  @Column({ name: 'ContactPerson', type: 'nvarchar', length: 50, nullable: false })
  contactPerson: string

  @Column({ name: 'ContactNumber', type: 'nvarchar', length: 50, nullable: false })
  contactNumber: string

  @Column({ name: 'CreditLimit', type: 'decimal', precision: 18, scale: 5, nullable: false })
  creditLimit: number

  @Column({ name: 'TermId', type: 'int', nullable: false })
  termId: number

  @Column({ name: 'TIN', type: 'nvarchar', length: 50, nullable: false })
  tin: string

  @Column({ name: 'WithReward', type: 'bit', nullable: false })
  withReward: boolean

  @Column({ name: 'RewardNumber', type: 'nvarchar', length: 50, nullable: true })
  rewardNumber: string | null

  @Column({ name: 'RewardConversion', type: 'decimal', precision: 18, scale: 5, nullable: false })
  rewardConversion: number

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

  @Column({ name: 'DefaultPriceDescription', type: 'nvarchar', length: 255, nullable: true })
  defaultPriceDescription: string | null

  @Column({ name: 'CustomerCode', type: 'nvarchar', length: 50, nullable: true })
  customerCode: string | null

  @Column({ name: 'BusinessStyle', type: 'nvarchar', nullable: true })
  businessStyle: string | null
}
