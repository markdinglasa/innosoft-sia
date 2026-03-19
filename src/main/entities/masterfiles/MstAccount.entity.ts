import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_ACCOUNT)
export class MstAccountEntity extends BaseEntity {
  constructor() {
    super()
    this.account = ''
    this.accountType = ''
    this.accountCode = ''
    this.isDefault = false
  }

  @Column({ name: 'AccountCode', type: 'nvarchar', length: 250 })
  accountCode: string

  @Column({ name: 'Account', type: 'nvarchar', nullable: false })
  account: string

  @Column({ name: 'AccountType', type: 'nvarchar', nullable: false })
  accountType: string

  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean
}
