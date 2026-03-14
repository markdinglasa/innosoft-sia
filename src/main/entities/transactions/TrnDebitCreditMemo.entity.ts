import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.TRN_DEBIT_CREDIT_MEMO)
export class TrnDebitCreditMemoEntity extends BaseEntity {
  constructor() {
    super()
    this.periodId = 0
    this.dcMemoNumber = ''
    this.dcMemoDate = new Date()
    this.particulars = ''
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
  }

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'DCMemoNumber', type: 'nvarchar', length: 50, nullable: false })
  dcMemoNumber: string

  @Column({ name: 'DCMemoDate', type: 'datetime', nullable: false })
  dcMemoDate: Date

  @Column({ name: 'Particulars', type: 'nvarchar', length: 255, nullable: false })
  particulars: string

  @Column({ name: 'PreparedBy', type: 'int', nullable: false })
  preparedBy: number

  @Column({ name: 'CheckedBy', type: 'int', nullable: false })
  checkedBy: number

  @Column({ name: 'ApprovedBy', type: 'int', nullable: false })
  approvedBy: number
}
