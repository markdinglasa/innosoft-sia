import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstPeriodEntity } from '../masterfiles/MstPeriod.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'

@Entity(POSEntity.TRN_DEBIT_CREDIT_MEMO)
export class TrnDebitCreditMemoEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.periodId = 0
    this.dcMemoNumber = ''
    this.dcMemoDate = new Date()
    this.particulars = ''
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
    this.memoType = 'DEBIT'
    this.amount = 0
    this.terminalId = ''
    this.cardType = ''
    this.authorizationCode = ''
  }
  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'DCMemoNumber', type: 'nvarchar', length: 50, nullable: false })
  dcMemoNumber: string

  @Column({ name: 'DCMemoDate', type: 'datetimeoffset', nullable: false })
  dcMemoDate: Date

  @Column({ name: 'MemoType', type: 'nvarchar', length: 20, nullable: false })
  memoType: 'DEBIT' | 'CREDIT'

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

  @Column({ name: 'Particulars', type: 'nvarchar', length: 500, nullable: false })
  particulars: string

  @Column({ name: 'TerminalId', type: 'nvarchar', length: 50, nullable: true })
  terminalId?: string

  @Column({ name: 'CardType', type: 'nvarchar', length: 50, nullable: true })
  cardType?: string

  @Column({ name: 'AuthorizationCode', type: 'nvarchar', length: 100, nullable: true })
  authorizationCode?: string

  @Column({ name: 'PreparedBy', type: 'int', nullable: false })
  preparedBy: number

  @Column({ name: 'CheckedBy', type: 'int', nullable: false })
  checkedBy: number

  @Column({ name: 'ApprovedBy', type: 'int', nullable: false })
  approvedBy: number

  // FK Relationships
  @ManyToOne(() => MstPeriodEntity)
  @JoinColumn({ name: 'PeriodId' })
  period?: MstPeriodEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'PreparedBy' })
  preparedByUser?: MstUserEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'CheckedBy' })
  checkedByUser?: MstUserEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'ApprovedBy' })
  approvedByUser?: MstUserEntity
}

