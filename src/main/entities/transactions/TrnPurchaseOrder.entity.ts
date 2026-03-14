import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.TRN_PURCHASE_ORDER)
export class TrnPurchaseOrderEntity extends BaseEntity {
  constructor() {
    super()
    this.periodId = 0
    this.purchaseOrderDate = new Date()
    this.purchaseOrderNumber = ''
    this.amount = 0
    this.supplierId = 0
    this.remarks = null
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
    this.requestedBy = null
  }

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'PurchaseOrderDate', type: 'datetime', nullable: false })
  purchaseOrderDate: Date

  @Column({ name: 'PurchaseOrderNumber', type: 'nvarchar', length: 50, nullable: false })
  purchaseOrderNumber: string

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

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
}
