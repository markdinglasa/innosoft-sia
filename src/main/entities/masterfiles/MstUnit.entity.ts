import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_UNIT)
export class MstUnitEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.name = ''
    this.description = null
    this.isDefault = false

  }
  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'Name', type: 'nvarchar', length: 50, nullable: false })
  name: string

  @Column({ name: 'Description', type: 'text', nullable: true })
  description: string | null

  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean

}
