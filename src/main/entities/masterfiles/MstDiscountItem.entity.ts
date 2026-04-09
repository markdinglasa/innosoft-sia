import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstDiscountEntity } from './MstDiscount.entity'
import { MstItemEntity } from './MstItem.entity'

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

  // FK Relationships
  @ManyToOne(() => MstDiscountEntity)
  @JoinColumn({ name: 'DiscountId' })
  discount?: MstDiscountEntity

  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity
}

