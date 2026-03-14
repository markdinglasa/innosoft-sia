import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.TRN_STOCK_OUT)
export class TrnStockOutEntity extends BaseEntity {
  constructor() {
    super()
    this.periodId = 0
    this.stockOutDate = new Date()
    this.stockOutNumber = ''
    this.accountId = 0
    this.remarks = null
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
    this.branchId = null
  }

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'StockOutDate', type: 'datetime', nullable: false })
  stockOutDate: Date

  @Column({ name: 'StockOutNumber', type: 'nvarchar', length: 50, nullable: false })
  stockOutNumber: string

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

  @Column({ name: 'Remarks', type: 'nvarchar', nullable: true })
  remarks: string | null

  @Column({ name: 'PreparedBy', type: 'int', nullable: false })
  preparedBy: number

  @Column({ name: 'CheckedBy', type: 'int', nullable: false })
  checkedBy: number

  @Column({ name: 'ApprovedBy', type: 'int', nullable: false })
  approvedBy: number

  @Column({ name: 'BranchId', type: 'int', nullable: true })
  branchId: number | null
}
