import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstAccountEntity } from '../masterfiles/MstAccount.entity'
import { MstBranchEntity } from '../masterfiles/MstBranch.entity'
import { MstPeriodEntity } from '../masterfiles/MstPeriod.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'

@Entity(POSEntity.TRN_STOCK_OUT)
export class TrnStockOutEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.periodId = 0
    this.stockOutDate = new Date()
    this.stockOutNumber = ''
    this.accountId = 0
    this.remarks = null
    this.preparedBy = 0
    this.checkedBy = 0
    this.approvedBy = 0
  }
    @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'PeriodId', type: 'int', nullable: false })
  periodId: number

  @Column({ name: 'StockOutDate', type: 'datetimeoffset', nullable: false })
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

  // FK Relationships
  @ManyToOne(() => MstPeriodEntity)
  @JoinColumn({ name: 'PeriodId' })
  period?: MstPeriodEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AccountId' })
  account?: MstAccountEntity

  @ManyToOne(() => MstBranchEntity)
  @JoinColumn({ name: 'BranchId' })
  branch?: MstBranchEntity

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
