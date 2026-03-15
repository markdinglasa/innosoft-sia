import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstPeriodEntity } from '../masterfiles/MstPeriod.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'

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

  @Column({ name: 'DCMemoDate', type: 'datetimeoffset', nullable: false })
  dcMemoDate: Date

  @Column({ name: 'Particulars', type: 'nvarchar', length: 255, nullable: false })
  particulars: string

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
