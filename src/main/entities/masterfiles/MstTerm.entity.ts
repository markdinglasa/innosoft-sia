import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_TERM)
export class MstTermEntity extends BaseEntity {
  constructor() {
    super()
    this.term = ''
    this.numberOfDays = 0
  }

  @Column({ name: 'Term', type: 'nvarchar', length: 50, nullable: false })
  term: string

  @Column({ name: 'NumberOfDays', type: 'decimal', precision: 18, scale: 5, nullable: false })
  numberOfDays: number
}
