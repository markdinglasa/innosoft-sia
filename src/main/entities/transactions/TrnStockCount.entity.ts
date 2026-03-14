import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.TRN_STOCK_COUNT)
export class TrnStockCountEntity extends BaseEntity {
  constructor() {
    super()
    this.periodId = 0
    this.stockCountDate = new Date()
    this.stockCountNumber = ''
    this.remarks = ''
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
  }

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'StockCountDate', type: 'datetime', nullable: false })
  stockCountDate: Date

  @Column({ name: 'StockCountNumber', type: 'nvarchar', length: 50, nullable: false })
  stockCountNumber: string

  @Column({ name: 'Remarks', type: 'nvarchar', nullable: false })
  remarks: string

  @Column({ name: 'PreparedBy', type: 'int', nullable: false })
  preparedBy: number

  @Column({ name: 'CheckedBy', type: 'int', nullable: false })
  checkedBy: number

  @Column({ name: 'ApprovedBy', type: 'int', nullable: false })
  approvedBy: number
}
