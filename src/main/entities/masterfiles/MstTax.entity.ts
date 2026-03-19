import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstAccountEntity } from './MstAccount.entity'

@Entity(POSEntity.MST_TAX)
export class MstTaxEntity extends BaseEntity {
  constructor() {
    super()
    this.code = ''
    this.name = ''
    this.rate = 0
    this.accountId = 0
    this.isDefault = false
  }

  @Column({ name: 'Code', type: 'nvarchar', length: 50, nullable: false })
  code: string

  @Column({ name: 'Name', type: 'nvarchar', length: 50, nullable: false })
  name: string

  @Column({ name: 'Rate', type: 'decimal', precision: 18, scale: 5, nullable: false })
  rate: number

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

    @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean

  // FK Relationships
  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity
}
