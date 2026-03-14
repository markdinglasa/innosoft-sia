// CREATE TABLE [dbo].[MstDiscountItem](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[DiscountId] [int] NOT NULL,
// 	[ItemId] [int] NOT NULL,
// 	[IsAutoDiscount] [bit] NULL,

import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_DISCOUNT_ITEM)
export class MstDiscountItemEntity extends BaseEntity {
  constructor() {
    super()
    this.discountId = 0
    this.itemId = 0
    this.isAutoDiscount = false
  }

  @Column({ name: 'DiscountId', type: 'int', nullable: false })
  discountId: number

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'IsAutoDiscount', type: 'bit', nullable: false })
  isAutoDiscount: boolean
}
