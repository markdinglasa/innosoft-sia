

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstAccountEntity } from './MstAccount.entity'
import { MstTermEntity } from './MstTerm.entity'

@Entity(POSEntity.MST_CUSTOMER)
export class MstCustomerEntity extends BaseEntity {
  constructor() {
    super()
    this.name = ''
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
    this.isDefault = false
  }

  @Column({ name: 'Name', type: 'nvarchar', length: 50, nullable: false })
  name: string

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


  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean

  // FK Relationships
  @ManyToOne(() => MstTermEntity, (term) => term.customers)
  @JoinColumn({ name: 'TermId' })
  term?: MstTermEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity
}
