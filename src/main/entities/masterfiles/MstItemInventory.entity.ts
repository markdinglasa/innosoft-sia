// CREATE TABLE [dbo].[MstItemInventory](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[ItemId] [int] NOT NULL,
// 	[InventoryDate] [datetime] NOT NULL,
// 	[Quantity] [decimal](18, 5) NOT NULL,

import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_ITEM_INVENTORY)
export class MstItemInventoryEntity extends BaseEntity {
  constructor() {
    super()
    this.itemId = 0
    this.inventoryDate = new Date()
    this.quantity = 0
  }

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'InventoryDate', type: 'datetimeoffset', nullable: false })
  inventoryDate: Date

  @Column({ name: 'Quantity', type: 'decimal', nullable: false })
  quantity: number
}
