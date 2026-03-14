// CREATE TABLE [dbo].[MstItemPrice](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[ItemId] [int] NOT NULL,
// 	[PriceDescription] [nvarchar](255) NOT NULL,
// 	[Price] [decimal](18, 5) NOT NULL,
// 	[TriggerQuantity] [decimal](18, 5) NOT NULL,

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstItemEntity } from './MstItem.entity'

@Entity(POSEntity.MST_ITEM_PRICE)
export class MstItemPriceEntity extends BaseEntity {
  constructor() {
    super()
    this.price = 0
    this.itemId = 0
    this.priceDescription = 'NA'
    this.triggerQuantity = 0
  }

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'PriceDescription', type: 'nvarchar', length: 255, nullable: false })
  priceDescription: string

  @Column({ name: 'Price', type: 'decimal', precision: 18, scale: 5, nullable: false })
  price: number

  @Column({ name: 'TriggerQuantity', type: 'decimal', precision: 18, scale: 5, nullable: false })
  triggerQuantity: number

  // FK Relationships
  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity
}
