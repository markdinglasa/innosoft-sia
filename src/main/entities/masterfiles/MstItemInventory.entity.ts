import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_ITEM_INVENTORY)
export class MstItemInventoryEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.itemId = 0
    this.inventoryDate = new Date()
    this.quantity = 0
  }
  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'InventoryDate', type: 'datetimeoffset', nullable: false })
  inventoryDate: Date

  @Column({ name: 'Quantity', type: 'decimal', nullable: false })
  quantity: number
}
