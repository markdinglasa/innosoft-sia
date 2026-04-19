import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { PurchaseOrderStatus } from '../../../shared/types/purchase-order.types'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstPeriodEntity } from '../masterfiles/MstPeriod.entity'
import { MstSupplierEntity } from '../masterfiles/MstSupplier.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'
import { TrnPurchaseOrderApprovalEntity } from './TrnPurchaseOrderApproval.entity'
import { TrnPurchaseOrderLineEntity } from './TrnPurchaseOrderLine.entity'
import { TrnPurchaseOrderReceivingEntity } from './TrnPurchaseOrderReceiving.entity'

@Entity(POSEntity.TRN_PURCHASE_ORDER)
export class TrnPurchaseOrderEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.periodId = 0
    this.purchaseOrderDate = new Date()
    this.purchaseOrderNumber = ''
    this.amount = 0
    this.totalAmount = 0
    this.taxAmount = 0
    this.shippingAmount = 0
    this.discountAmount = 0
    this.supplierId = 0
    this.remarks = null
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
    this.requestedBy = null
    this.status = PurchaseOrderStatus.DRAFT
    this.approvalLevel = 0
    this.requiredApprovalLevel = 0
    this.version = 1
    this.actualDeliveryDate = null
    this.expectedDeliveryDate = null
    this.sentToSupplierDate = null
    this.actualDeliveryDate = null
    this.supplierConfirmationDate = null
    this.parentPurchaseOrderId = null
    this.cancellationReason = null
    this.cancelledBy = null
    this.cancelledDate = null
  }

  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'PurchaseOrderDate', type: 'datetimeoffset', nullable: false })
  purchaseOrderDate: Date

  @Column({ name: 'PurchaseOrderNumber', type: 'nvarchar', length: 50, nullable: false })
  purchaseOrderNumber: string

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

  @Column({
    name: 'Status',
    type: 'nvarchar',
    length: 50,
    nullable: false,
    default: PurchaseOrderStatus.DRAFT
  })
  status: PurchaseOrderStatus

  @Column({ name: 'ExpectedDeliveryDate', type: 'datetimeoffset', nullable: true })
  expectedDeliveryDate: Date | null

  @Column({ name: 'ActualDeliveryDate', type: 'datetimeoffset', nullable: true })
  actualDeliveryDate: Date | null

  @Column({
    name: 'TotalAmount',
    type: 'decimal',
    precision: 18,
    scale: 5,
    nullable: false,
    default: 0
  })
  totalAmount: number

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
    name: 'ShippingAmount',
    type: 'decimal',
    precision: 18,
    scale: 5,
    nullable: false,
    default: 0
  })
  shippingAmount: number

  @Column({
    name: 'DiscountAmount',
    type: 'decimal',
    precision: 18,
    scale: 5,
    nullable: false,
    default: 0
  })
  discountAmount: number

  @Column({ name: 'ApprovalLevel', type: 'int', nullable: false, default: 0 })
  approvalLevel: number

  @Column({ name: 'RequiredApprovalLevel', type: 'int', nullable: false, default: 0 })
  requiredApprovalLevel: number

  @Column({ name: 'SentToSupplierDate', type: 'datetimeoffset', nullable: true })
  sentToSupplierDate: Date | null

  @Column({ name: 'SupplierConfirmationDate', type: 'datetimeoffset', nullable: true })
  supplierConfirmationDate: Date | null

  @Column({ name: 'CancellationReason', type: 'nvarchar', nullable: true })
  cancellationReason: string | null

  @Column({ name: 'CancelledBy', type: 'int', nullable: true })
  cancelledBy: number | null

  @Column({ name: 'CancelledDate', type: 'datetimeoffset', nullable: true })
  cancelledDate: Date | null

  @Column({ name: 'Version', type: 'int', nullable: false, default: 1 })
  version: number

  @Column({ name: 'ParentPurchaseOrderId', type: 'int', nullable: true })
  parentPurchaseOrderId: number | null

  @Column({ name: 'SupplierId', type: 'int', nullable: false })
  supplierId: number

  @Column({ name: 'Remarks', type: 'nvarchar', nullable: true })
  remarks: string | null

  @Column({ name: 'PreparedBy', type: 'int', nullable: false })
  preparedBy: number

  @Column({ name: 'CheckedBy', type: 'int', nullable: false })
  checkedBy: number

  @Column({ name: 'ApprovedBy', type: 'int', nullable: false })
  approvedBy: number

  @Column({ name: 'RequestedBy', type: 'int', nullable: true })
  requestedBy: number | null

  // FK Relationships
  @ManyToOne(() => MstPeriodEntity)
  @JoinColumn({ name: 'PeriodId' })
  period?: MstPeriodEntity

  @ManyToOne(() => MstSupplierEntity)
  @JoinColumn({ name: 'SupplierId' })
  supplier?: MstSupplierEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'PreparedBy' })
  preparedByUser?: MstUserEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'CheckedBy' })
  checkedByUser?: MstUserEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'ApprovedBy' })
  approvedByUser?: MstUserEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'CancelledBy' })
  cancelledByUser?: MstUserEntity

  @ManyToOne(() => TrnPurchaseOrderEntity)
  @JoinColumn({ name: 'ParentPurchaseOrderId' })
  parentPurchaseOrder?: TrnPurchaseOrderEntity

  @OneToMany(() => TrnPurchaseOrderLineEntity, (line) => line.purchaseOrder, { cascade: true })
  lineItems?: TrnPurchaseOrderLineEntity[]

  @OneToMany(() => TrnPurchaseOrderApprovalEntity, (approval) => approval.purchaseOrder, {
    cascade: true
  })
  approvals?: TrnPurchaseOrderApprovalEntity[]

  @OneToMany(() => TrnPurchaseOrderReceivingEntity, (receiving) => receiving.purchaseOrder, {
    cascade: true
  })
  receivings?: TrnPurchaseOrderReceivingEntity[]
}

