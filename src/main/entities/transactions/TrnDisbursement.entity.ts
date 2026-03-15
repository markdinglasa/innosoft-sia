import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstPeriodEntity } from '../masterfiles/MstPeriod.entity'
import { MstAccountEntity } from '../masterfiles/MstAccount.entity'
import { MstPayTypeEntity } from '../masterfiles/MstPayType.entity'
import { TrnStockInEntity } from './TrnStockIn.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'

@Entity(POSEntity.TRN_DISBURSEMENT)
export class TrnDisbursementEntity extends BaseEntity {
  constructor() {
    super()
    this.periodId = 0
    this.disbursementDate = new Date()
    this.disbursementNumber = ''
    this.disbursementType = ''
    this.accountId = 0
    this.amount = 0
    this.payTypeId = 0
    this.terminalId = 0
    this.remarks = null
    this.isReturn = false
    this.stockInId = null
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
    this.amount1000 = null
    this.amount500 = null
    this.amount200 = null
    this.amount100 = null
    this.amount50 = null
    this.amount20 = null
    this.amount10 = null
    this.amount5 = null
    this.amount1 = null
    this.amount025 = null
    this.amount010 = null
    this.amount005 = null
    this.amount001 = null
    this.payee = null
  }

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'DisbursementDate', type: 'datetimeoffset', nullable: false })
  disbursementDate: Date

  @Column({ name: 'DisbursementNumber', type: 'nvarchar', length: 50, nullable: false })
  disbursementNumber: string

  @Column({ name: 'DisbursementType', type: 'nvarchar', length: 50, nullable: false })
  disbursementType: string

  @Column({ name: 'AccountId', type: 'int', nullable: false })
  accountId: number

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

  @Column({ name: 'PayTypeId', type: 'int', nullable: false })
  payTypeId: number

  @Column({ name: 'TerminalId', type: 'int', nullable: false })
  terminalId: number

  @Column({ name: 'Remarks', type: 'nvarchar', nullable: true })
  remarks: string | null

  @Column({ name: 'IsReturn', type: 'bit', nullable: false })
  isReturn: boolean

  @Column({ name: 'StockInId', type: 'int', nullable: true })
  stockInId: number | null

  @Column({ name: 'PreparedBy', type: 'int', nullable: false })
  preparedBy: number

  @Column({ name: 'CheckedBy', type: 'int', nullable: false })
  checkedBy: number

  @Column({ name: 'ApprovedBy', type: 'int', nullable: false })
  approvedBy: number

  @Column({ name: 'Amount1000', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount1000: number | null

  @Column({ name: 'Amount500', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount500: number | null

  @Column({ name: 'Amount200', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount200: number | null

  @Column({ name: 'Amount100', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount100: number | null

  @Column({ name: 'Amount50', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount50: number | null

  @Column({ name: 'Amount20', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount20: number | null

  @Column({ name: 'Amount10', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount10: number | null

  @Column({ name: 'Amount5', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount5: number | null

  @Column({ name: 'Amount1', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount1: number | null

  @Column({ name: 'Amount025', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount025: number | null

  @Column({ name: 'Amount010', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount010: number | null

  @Column({ name: 'Amount005', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount005: number | null

  @Column({ name: 'Amount001', type: 'decimal', precision: 18, scale: 5, nullable: true })
  amount001: number | null

  @Column({ name: 'Payee', type: 'nvarchar', length: 255, nullable: true })
  payee: string | null

  // FK Relationships
  @ManyToOne(() => MstPeriodEntity)
  @JoinColumn({ name: 'PeriodId' })
  period?: MstPeriodEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity

  @ManyToOne(() => MstPayTypeEntity)
  @JoinColumn({ name: 'PayTypeId' })
  payType?: MstPayTypeEntity

  @ManyToOne(() => TrnStockInEntity)
  @JoinColumn({ name: 'StockInId' })
  stockIn?: TrnStockInEntity

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
