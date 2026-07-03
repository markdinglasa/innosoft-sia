import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.SYS_AUDIT_TRAIL)
export class SysAuditTrailEntity {
  constructor() {
    this.id = 0
    this.userId = 0
    this.auditDate = new Date()
    this.tableInformation = ''
    this.recordInformation = ''
    this.formInformation = ''
    this.actionInformation = ''
    this.oldItem = null
    this.newItem = null
    this.oldPrice = null
    this.newPrice = null
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'UserId', type: 'int', nullable: false })
  userId: number

  @Column({ name: 'AuditDate', type: 'datetime', nullable: false })
  auditDate: Date

  @Column({ name: 'TableInformation', type: 'nvarchar', length: 255, nullable: false })
  tableInformation: string

  @Column({ name: 'RecordInformation', type: 'nvarchar', length: 255, nullable: false })
  recordInformation: string

  @Column({ name: 'FormInformation', type: 'nvarchar', length: 255, nullable: false })
  formInformation: string

  @Column({ name: 'ActionInformation', type: 'nvarchar', length: 255, nullable: false })
  actionInformation: string

  @Column({ name: 'OldItem', type: 'nvarchar', length: 250, nullable: true })
  oldItem: string | null

  @Column({ name: 'NewItem', type: 'nvarchar', length: 250, nullable: true })
  newItem: string | null

  @Column({ name: 'OldPrice', type: 'decimal', precision: 18, scale: 2, nullable: true })
  oldPrice: number | null

  @Column({ name: 'NewPrice', type: 'decimal', precision: 18, scale: 2, nullable: true })
  newPrice: number | null
}
