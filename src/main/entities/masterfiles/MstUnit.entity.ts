import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_UNIT)
export class MstUnitEntity extends BaseEntity {
  constructor() {
    super()
    this.unit = ''
  }

  @Column({ name: 'Unit', type: 'nvarchar', length: 50, nullable: false })
  unit: string
}
