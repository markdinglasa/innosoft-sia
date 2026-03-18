import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE'
export type SyncStatus = 'pending' | 'synced' | 'failed'

@Entity('SyncQueue')
export class SyncQueueEntity {
  constructor() {
    this.id = 0
    this.tableName = ''
    this.operation = 'CREATE'
    this.payload = ''
    this.entityId = null
    this.status = 'pending'
    this.retries = 0
    this.createdAt = new Date()
    this.syncedAt = null
    this.errorMessage = null
  }

  @PrimaryGeneratedColumn()
  id: number

  /** The MSSQL table name the operation targets */
  @Column({ type: 'text' })
  tableName: string

  /** CREATE | UPDATE | DELETE */
  @Column({ type: 'text' })
  operation: SyncOperation

  /** JSON-serialized entity data / partial update payload */
  @Column({ type: 'text' })
  payload: string

  /** The primary key of the record being updated/deleted (null for CREATE) */
  @Column({ type: 'text', nullable: true })
  entityId: string | null

  /** Current sync status */
  @Column({ type: 'text', default: 'pending' })
  status: SyncStatus

  /** How many times sync was attempted and failed */
  @Column({ type: 'integer', default: 0 })
  retries: number

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'datetime', nullable: true })
  syncedAt: Date | null

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null
}
