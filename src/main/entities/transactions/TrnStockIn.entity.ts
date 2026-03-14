import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.TRN_STOCK_IN)
export class TrnStockInEntity extends BaseEntity {
  constructor() {
    super()
    this.periodId = 0
    this.stockInDate = new Date()
    this.stockInNumber = ''
    this.supplierId = 0
    this.remarks = null
    this.isReturn = false
    this.collectionId = null
    this.purchaseOrderId = null
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
    this.salesId = null
    this.branchId = null
  }

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'StockInDate', type: 'datetime', nullable: false })
  stockInDate: Date

  @Column({ name: 'StockInNumber', type: 'nvarchar', length: 50, nullable: false })
  stockInNumber: string

  @Column({ name: 'SupplierId', type: 'int', nullable: false })
  supplierId: number

  @Column({ name: 'Remarks', type: 'nvarchar', nullable: true })
  remarks: string | null

  @Column({ name: 'IsReturn', type: 'bit', nullable: false })
  isReturn: boolean

  @Column({ name: 'CollectionId', type: 'int', nullable: true })
  collectionId: number | null

  @Column({ name: 'PurchaseOrderId', type: 'int', nullable: true })
  purchaseOrderId: number | null

  @Column({ name: 'PreparedBy', type: 'int', nullable: false })
  preparedBy: number

  @Column({ name: 'CheckedBy', type: 'int', nullable: false })
  checkedBy: number

  @Column({ name: 'ApprovedBy', type: 'int', nullable: false })
  approvedBy: number

  @Column({ name: 'SalesId', type: 'int', nullable: true })
  salesId: number | null

  @Column({ name: 'BranchId', type: 'int', nullable: true })
  branchId: number | null
}
