import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from "../generic"
import { MstItemEntity } from '../masterfiles/MstItem.entity'
import { MstUnitEntity } from '../masterfiles/MstUnit.entity'
import { TrnPurchaseOrderEntity } from './TrnPurchaseOrder.entity'

@Entity(POSEntity.TRN_PURCHASE_ORDER_LINE)
export class TrnPurchaseOrderLineEntity  extends BaseEntity{
  constructor() {
    super()
    this.purchaseOrderId = 0
    this.itemId = 0
    this.unitId = 0
    this.quantity = 0
    this.cost = 0
    this.amount = 0
  }

  @Column({ name: 'PurchaseOrderId', type: 'int', nullable: false })
  purchaseOrderId: number

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'UnitId', type: 'int', nullable: false })
  unitId: number

  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 5, nullable: false })
  quantity: number

  @Column({ name: 'Cost', type: 'decimal', precision: 18, scale: 5, nullable: false })
  cost: number

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

  // FK Relationships
  @ManyToOne(() => TrnPurchaseOrderEntity)
  @JoinColumn({ name: 'PurchaseOrderId' })
  purchaseOrder?: TrnPurchaseOrderEntity

  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity

  @ManyToOne(() => MstUnitEntity)
  @JoinColumn({ name: 'UnitId' })
  unit?: MstUnitEntity
}
