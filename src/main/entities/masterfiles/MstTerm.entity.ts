import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_TERM)
export class MstTermEntity extends BaseEntity {
  constructor() {
    super()
    this.name = ''
    this.numberOfDays = 0
    this.isDefault = false
  }

  @Column({ name: 'Name', type: 'nvarchar', length: 50, nullable: false })
  name: string

  @Column({ name: 'NumberOfDays', type: 'decimal', precision: 18, scale: 5, nullable: false })
  numberOfDays: number

  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean
}
