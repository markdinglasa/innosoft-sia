import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstTerminalEntity } from '../masterfiles/MstTerminal.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'

@Entity(POSEntity.TRN_SHIFT)
export class TrnShiftEntity extends BaseEntity {
  constructor() {
    super()
    this.userId = 0
    this.terminalId = 0
    this.status = 'Open'
    this.openDate = new Date()
    this.startingCash = 0
    this.endingCash = 0
    this.expectedCash = 0
    this.totalSales = 0
    this.totalCollections = 0
    this.totalDisbursements = 0
  }

  @Column({ name: 'UserId', type: 'int', nullable: false })
  userId: number

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'UserId' })
  user?: MstUserEntity

  @Column({ name: 'TerminalId', type: 'int', nullable: false })
  terminalId: number

  @ManyToOne(() => MstTerminalEntity)
  @JoinColumn({ name: 'TerminalId' })
  terminal?: MstTerminalEntity

  @Column({ name: 'Status', type: 'nvarchar', length: 20, nullable: false })
  status: 'Open' | 'Closed'

  @Column({ name: 'OpenDate', type: 'datetime', nullable: false })
  openDate: Date

  @Column({ name: 'CloseDate', type: 'datetime', nullable: true })
  closeDate?: Date

  @Column({ name: 'StartingCash', type: 'decimal', precision: 18, scale: 5, nullable: false })
  startingCash: number

  @Column({ name: 'EndingCash', type: 'decimal', precision: 18, scale: 5, nullable: false })
  endingCash: number

  @Column({ name: 'ExpectedCash', type: 'decimal', precision: 18, scale: 5, nullable: false })
  expectedCash: number

  @Column({ name: 'TotalSales', type: 'decimal', precision: 18, scale: 5, nullable: false })
  totalSales: number

  @Column({ name: 'TotalCollections', type: 'decimal', precision: 18, scale: 5, nullable: false })
  totalCollections: number

  @Column({ name: 'TotalDisbursements', type: 'decimal', precision: 18, scale: 5, nullable: false })
  totalDisbursements: number

  @Column({ name: 'Remarks', type: 'nvarchar', length: 'max', nullable: true })
  remarks?: string
}
