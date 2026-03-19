import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_ACCOUNT)
export class MstAccountEntity extends BaseEntity {
  constructor() {
    super()
    this.name = ''
    this.type = ''
    this.code = ''
    this.isDefault = false
  }

  @Column({ name: 'Code', type: 'nvarchar', length: 250 })
  code: string

  @Column({ name: 'Name', type: 'nvarchar', nullable: false })
  name: string

  @Column({ name: 'Type', type: 'nvarchar', nullable: false })
  type: string

  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean
}
