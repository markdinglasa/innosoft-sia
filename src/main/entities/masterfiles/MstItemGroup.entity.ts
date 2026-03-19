import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_ITEM_GROUP)
export class MstItemGroupEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.name = ''
    this.imagePatch = null
    this.kitchenReport = ''
  }
    @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'Name', type: 'nvarchar', length: 50 })
  name: string

  @Column({ name: 'ImagePatch', type: 'nvarchar', length: 255, nullable: true })
  imagePatch: string | null

  @Column({ name: 'KitchenReport', type: 'nvarchar', length: 255, nullable: true })
  kitchenReport: string | null
}
