import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { ReceivingStatus } from '../../../shared/types/purchase-order.types'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'
import { TrnPurchaseOrderEntity } from './TrnPurchaseOrder.entity'
import { TrnPurchaseOrderReceivingLineEntity } from './TrnPurchaseOrderReceivingLine.entity'

@Entity(POSEntity.TRN_PURCHASE_ORDER_RECEIVING)
export class TrnPurchaseOrderReceivingEntity extends BaseEntity {
  constructor() {
    super()
    this.purchaseOrderId = 0
    this.receivingNumber = ''
    this.receivingDate = new Date()
    this.receivedBy = 0
    this.status = ReceivingStatus.PENDING
    this.deliveryNote = null
    this.notes = null
  }

  @Column({ name: 'PurchaseOrderId', type: 'int', nullable: false })
  purchaseOrderId: number

  @Column({ name: 'ReceivingNumber', type: 'nvarchar', length: 50, nullable: false })
  receivingNumber: string

  @Column({ name: 'ReceivingDate', type: 'datetimeoffset', nullable: false })
  receivingDate: Date

  @Column({ name: 'ReceivedBy', type: 'int', nullable: false })
  receivedBy: number

  @Column({ name: 'DeliveryNote', type: 'nvarchar', length: 100, nullable: true })
  deliveryNote: string | null

  @Column({ name: 'Notes', type: 'nvarchar', length: 1000, nullable: true })
  notes: string | null

  @Column({
    name: 'Status',
    type: 'nvarchar',
    length: 50,
    nullable: false,
    default: ReceivingStatus.PENDING
  })
  status: ReceivingStatus

  // Relationships
  @ManyToOne(() => TrnPurchaseOrderEntity, (po) => po.receivings)
  @JoinColumn({ name: 'PurchaseOrderId' })
  purchaseOrder?: TrnPurchaseOrderEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'ReceivedBy' })
  receivedByUser?: MstUserEntity

  @OneToMany(() => TrnPurchaseOrderReceivingLineEntity, (line) => line.receiving, { cascade: true })
  lineItems?: TrnPurchaseOrderReceivingLineEntity[]
}

