import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.TRN_COLLECTION)
export class TrnCollectionEntity extends BaseEntity {
  constructor() {
    super()
    this.periodId = 0
    this.collectionDate = new Date()
    this.collectionNumber = ''
    this.terminalId = 0
    this.manualORNumber = ''
    this.customerId = 0
    this.remarks = null
    this.salesId = null
    this.salesBalanceAmount = 0
    this.amount = 0
    this.tenderAmount = 0
    this.changeAmount = 0
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
    this.isReturned = null
    this.isCancelled = false
    this.postCode = null
  }

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'CollectionDate', type: 'datetime', nullable: false })
  collectionDate: Date

  @Column({ name: 'CollectionNumber', type: 'nvarchar', length: 50, nullable: false })
  collectionNumber: string

  @Column({ name: 'TerminalId', type: 'int', nullable: false })
  terminalId: number

  @Column({ name: 'ManualORNumber', type: 'nvarchar', length: 50, nullable: false })
  manualORNumber: string

  @Column({ name: 'CustomerId', type: 'int', nullable: false })
  customerId: number

  @Column({ name: 'Remarks', type: 'nvarchar', nullable: true })
  remarks: string | null

  @Column({ name: 'SalesId', type: 'int', nullable: true })
  salesId: number | null

  @Column({ name: 'SalesBalanceAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  salesBalanceAmount: number

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

  @Column({ name: 'TenderAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  tenderAmount: number

  @Column({ name: 'ChangeAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  changeAmount: number

  @Column({ name: 'PreparedBy', type: 'int', nullable: false })
  preparedBy: number

  @Column({ name: 'CheckedBy', type: 'int', nullable: false })
  checkedBy: number

  @Column({ name: 'ApprovedBy', type: 'int', nullable: false })
  approvedBy: number

  @Column({ name: 'IsReturned', type: 'int', nullable: true })
  isReturned: number | null

  @Column({ name: 'IsCancelled', type: 'bit', nullable: false })
  isCancelled: boolean

  @Column({ name: 'PostCode', type: 'nvarchar', length: 50, nullable: true })
  postCode: string | null
}
