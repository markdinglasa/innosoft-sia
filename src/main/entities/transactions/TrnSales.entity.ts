import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstPeriodEntity } from '../masterfiles/MstPeriod.entity'
import { MstTableEntity } from '../masterfiles/MstTable.entity'
import { MstCustomerEntity } from '../masterfiles/MstCustomer.entity'
import { MstAccountEntity } from '../masterfiles/MstAccount.entity'
import { MstTermEntity } from '../masterfiles/MstTerm.entity'
import { MstTerminalEntity } from '../masterfiles/MstTerminal.entity'
import { MstDiscountEntity } from '../masterfiles/MstDiscount.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'
import { TrnSalesLineEntity } from './TrnSalesLine.entity'
import { TrnCollectionEntity } from './TrnCollection.entity'

@Entity(POSEntity.TRN_SALES)
export class TrnSalesEntity extends BaseEntity {
  constructor() {
    super()
    this.periodId = 0
    this.salesDate = new Date()
    this.salesNumber = ''
    this.manualInvoiceNumber = null
    this.amount = 0
    this.tableId = null
    this.customerId = 0
    this.accountId = 0
    this.termId = 0
    this.discountId = null
    this.seniorCitizenId = null
    this.seniorCitizenName = null
    this.seniorCitizenAge = null
    this.remarks = null
    this.salesAgent = 0
    this.terminalId = 0
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
    this.isReturn = null
    this.isCancelled = false
    this.paidAmount = 0
    this.creditAmount = 0
    this.debitAmount = 0
    this.balanceAmount = 0
    this.pax = null
    this.tableStatus = 0
    this.childName = null
    this.dateOfBirth = null
    this.tinNumber = null
    this.isBilledOut = false
  }

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'SalesDate', type: 'datetimeoffset', nullable: false })
  salesDate: Date

  @Column({ name: 'SalesNumber', type: 'nvarchar', length: 50, nullable: false })
  salesNumber: string

  @Column({ name: 'ManualInvoiceNumber', type: 'nvarchar', length: 50, nullable: true })
  manualInvoiceNumber: string | null

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

  @Column({ name: 'TableId', type: 'int', nullable: true })
  tableId: number | null

  @Column({ name: 'CustomerId', type: 'int', nullable: false })
  customerId: number

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

  @Column({ name: 'TermId', type: 'int', nullable: false })
  termId: number

  @Column({ name: 'DiscountId', type: 'int', nullable: true })
  discountId: number | null

  @Column({ name: 'SeniorCitizenId', type: 'nvarchar', length: 50, nullable: true })
  seniorCitizenId: string | null

  @Column({ name: 'SeniorCitizenName', type: 'nvarchar', length: 255, nullable: true })
  seniorCitizenName: string | null

  @Column({ name: 'SeniorCitizenAge', type: 'int', nullable: true })
  seniorCitizenAge: number | null

  @Column({ name: 'Remarks', type: 'nvarchar', nullable: true })
  remarks: string | null

  @Column({ name: 'SalesAgent', type: 'int', nullable: false })
  salesAgent: number

  @Column({ name: 'TerminalId', type: 'int', nullable: false })
  terminalId: number

  @Column({ name: 'PreparedBy', type: 'int', nullable: false })
  preparedBy: number

  @Column({ name: 'CheckedBy', type: 'int', nullable: false })
  checkedBy: number

  @Column({ name: 'ApprovedBy', type: 'int', nullable: false })
  approvedBy: number

  @Column({ name: 'IsReturn', type: 'int', nullable: true })
  isReturn: number | null

  @Column({ name: 'IsCancelled', type: 'bit', nullable: false })
  isCancelled: boolean

  @Column({ name: 'PaidAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  paidAmount: number

  @Column({ name: 'CreditAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  creditAmount: number

  @Column({ name: 'DebitAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  debitAmount: number

  @Column({ name: 'BalanceAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  balanceAmount: number

  @Column({ name: 'Pax', type: 'int', nullable: true })
  pax: number | null

  @Column({ name: 'TableStatus', type: 'int', nullable: false })
  tableStatus: number

  @Column({ name: 'ChildName', type: 'nvarchar', length: 100, nullable: true })
  childName: string | null

  @Column({ name: 'DateOfBirth', type: 'datetimeoffset', nullable: true })
  dateOfBirth: Date | null

  @Column({ name: 'TINNumber', type: 'nvarchar', length: 50, nullable: true })
  tinNumber: string | null

  @Column({ name: 'IsBilledOut', type: 'bit', nullable: false })
  isBilledOut: boolean

  // FK Relationships
  @ManyToOne(() => MstPeriodEntity)
  @JoinColumn({ name: 'PeriodId' })
  period?: MstPeriodEntity

  @ManyToOne(() => MstTableEntity)
  @JoinColumn({ name: 'TableId' })
  table?: MstTableEntity

  @ManyToOne(() => MstCustomerEntity)
  @JoinColumn({ name: 'CustomerId' })
  customer?: MstCustomerEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity

  @ManyToOne(() => MstTermEntity)
  @JoinColumn({ name: 'TermId' })
  term?: MstTermEntity

  @ManyToOne(() => MstTerminalEntity)
  @JoinColumn({ name: 'TerminalId' })
  terminal?: MstTerminalEntity

  @ManyToOne(() => MstDiscountEntity)
  @JoinColumn({ name: 'DiscountId' })
  discount?: MstDiscountEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'PreparedBy' })
  preparedByUser?: MstUserEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'CheckedBy' })
  checkedByUser?: MstUserEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'ApprovedBy' })
  approvedByUser?: MstUserEntity



  @OneToMany(() => TrnSalesLineEntity, (salesLine) => salesLine.sales)
  salesLines?: TrnSalesLineEntity[]

  @OneToMany(() => TrnCollectionEntity, (collection) => collection.sales)
  collections?: TrnCollectionEntity[]
}
