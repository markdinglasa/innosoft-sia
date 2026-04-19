import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { LineItemStatus } from '../../../shared/types/purchase-order.types'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstItemEntity } from '../masterfiles/MstItem.entity'
import { MstUnitEntity } from '../masterfiles/MstUnit.entity'
import { TrnPurchaseOrderEntity } from './TrnPurchaseOrder.entity'

@Entity(POSEntity.TRN_PURCHASE_ORDER_LINE)
export class TrnPurchaseOrderLineEntity extends BaseEntity {
  constructor() {
    super()
    this.purchaseOrderId = 0
    this.itemId = 0
    this.unitId = 0
    this.quantity = 0
    this.cost = 0
    this.amount = 0
    this.lineNumber = 0
    this.unitCost = 0
    this.totalCost = 0
    this.taxRate = 0
    this.taxAmount = 0
    this.discountRate = 0
    this.discountAmount = 0
    this.receivedQuantity = 0
    this.remainingQuantity = 0
    this.description = null
    this.expectedDeliveryDate = null
    this.supplierItemCode = null
    this.notes = null
    this.status = LineItemStatus.PENDING
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

  @Column({ name: 'LineNumber', type: 'int', nullable: false })
  lineNumber: number

  @Column({ name: 'Description', type: 'nvarchar', length: 500, nullable: true })
  description: string | null

  @Column({ name: 'UnitCost', type: 'decimal', precision: 18, scale: 5, nullable: false })
  unitCost: number

  @Column({ name: 'TotalCost', type: 'decimal', precision: 18, scale: 5, nullable: false })
  totalCost: number

  @Column({ name: 'TaxRate', type: 'decimal', precision: 5, scale: 2, nullable: false, default: 0 })
  taxRate: number

  @Column({
    name: 'TaxAmount',
    type: 'decimal',
    precision: 18,
    scale: 5,
    nullable: false,
    default: 0
  })
  taxAmount: number

  @Column({
    name: 'DiscountRate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
    default: 0
  })
  discountRate: number

  @Column({
    name: 'DiscountAmount',
    type: 'decimal',
    precision: 18,
    scale: 5,
    nullable: false,
    default: 0
  })
  discountAmount: number

  @Column({
    name: 'ReceivedQuantity',
    type: 'decimal',
    precision: 18,
    scale: 5,
    nullable: false,
    default: 0
  })
  receivedQuantity: number

  @Column({ name: 'RemainingQuantity', type: 'decimal', precision: 18, scale: 5, nullable: false })
  remainingQuantity: number

  @Column({
    name: 'Status',
    type: 'nvarchar',
    length: 50,
    nullable: false,
    default: LineItemStatus.PENDING
  })
  status: LineItemStatus

  @Column({ name: 'ExpectedDeliveryDate', type: 'datetimeoffset', nullable: true })
  expectedDeliveryDate: Date | null

  @Column({ name: 'SupplierItemCode', type: 'nvarchar', length: 100, nullable: true })
  supplierItemCode: string | null

  @Column({ name: 'Notes', type: 'nvarchar', length: 1000, nullable: true })
  notes: string | null

  // FK Relationships
  @ManyToOne(() => TrnPurchaseOrderEntity, (po) => po.lineItems)
  @JoinColumn({ name: 'PurchaseOrderId' })
  purchaseOrder?: TrnPurchaseOrderEntity

  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity

  @ManyToOne(() => MstUnitEntity)
  @JoinColumn({ name: 'UnitId' })
  unit?: MstUnitEntity
}

