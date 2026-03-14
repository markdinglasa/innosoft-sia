import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_BRANCH)
export class MstBranchEntity extends BaseEntity {
  constructor() {
    super()
    this.branchName = ''
    this.address = ''
  }

  @Column({ name: 'BranchName', type: 'nvarchar', length: 250 })
  branchName: string

  @Column({ name: 'Address', type: 'text', nullable: true })
  address: string
}
