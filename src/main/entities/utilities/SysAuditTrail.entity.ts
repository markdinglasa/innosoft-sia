import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.SYS_AUDIT_TRAIL)
export class SysAuditTrailEntity {
  constructor() {
    this.userId = 0
    this.auditDate = new Date()
    this.tableInformation = ''
    this.recordInformation = ''
    this.actionInformation = ''
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id!: number

  @Column({ name: 'UserId', type: 'int', nullable: false })
  userId: number

  @Column({ name: 'AuditDate', type: 'datetimeoffset', nullable: false })
  auditDate: Date

  @Column({ name: 'TableInformation', type: 'nvarchar', length: 255, nullable: false })
  tableInformation: string

  @Column({ name: 'RecordInformation', type: 'nvarchar', length: 255, nullable: false })
  recordInformation: string

  @Column({ name: 'ActionInformation', type: 'nvarchar', length: 255, nullable: false })
  actionInformation: string

  @Column({ name: 'OldData', type: 'nvarchar', length: 'max', nullable: true })
  oldData?: string | null

  @Column({ name: 'NewData', type: 'nvarchar', length: 'max', nullable: true })
  newData?: string | null
}
