import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_ACCOUNT)
export class MstAccountEtity extends BaseEntity {
  constructor() {
    super()
    this.code = ''
    this.account = ''
    this.accountType = ''
  }

  @Column({ name: 'Code', type: 'nvarchar', length: 250 })
  code: string

  @Column({ name: 'Account', type: 'nvarchar', nullable: false })
  account: string

  @Column({ name: 'AccountType', type: 'nvarchar', nullable: false })
  accountType: string
}
