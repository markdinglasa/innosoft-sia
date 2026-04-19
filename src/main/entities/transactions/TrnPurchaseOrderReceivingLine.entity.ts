import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstItemEntity } from '../masterfiles/MstItem.entity'
import { MstUnitEntity } from '../masterfiles/MstUnit.entity'
import { TrnPurchaseOrderReceivingEntity } from './TrnPurchaseOrderReceiving.entity'

@Entity(POSEntity.TRN_PURCHASE_ORDER_RECEIVING_LINE)
export class TrnPurchaseOrderReceivingLineEntity extends BaseEntity {
  constructor() {
    super()
    this.receivingId = 0
    this.itemId = 0
    this.unitId = 0
    this.quantity = 0
    this.remarks = null
  }

  @Column({ name: 'ReceivingId', type: 'int', nullable: false })
  receivingId: number

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'UnitId', type: 'int', nullable: false })
  unitId: number

  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 5, nullable: false })
  quantity: number

  @Column({ name: 'Remarks', type: 'nvarchar', length: 500, nullable: true })
  remarks: string | null

  // Relationships
  @ManyToOne(() => TrnPurchaseOrderReceivingEntity, (receiving) => receiving.lineItems)
  @JoinColumn({ name: 'ReceivingId' })
  receiving?: TrnPurchaseOrderReceivingEntity

  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity

  @ManyToOne(() => MstUnitEntity)
  @JoinColumn({ name: 'UnitId' })
  unit?: MstUnitEntity
}

