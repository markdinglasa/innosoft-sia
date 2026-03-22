import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm'

/**
 * Base class for all Mirror (Shadow) entities in SQLite.
 * Unlike standard entities, the Id is NOT auto-generated because it 
 * is replicated from the main MSSQL server.
 */
export abstract class MirrorBaseEntity {
  constructor() {
    this.isLocked = false
    this.entryUserId = 0
    this.entryDateTime = new Date()
  }

  @PrimaryColumn({ name: 'Id', type: 'int' })
  id!: number

  @Column({ name: 'IsLocked', type: 'boolean', default: false })
  isLocked: boolean

  @Column({ name: 'EntryUserId', type: 'int' })
  entryUserId: number

  @CreateDateColumn({ name: 'EntryDateTime' })
  entryDateTime: Date

  @Column({ name: 'UpdateUserId', type: 'int', nullable: true })
  updateUserId?: number | null

  @UpdateDateColumn({ name: 'UpdateDateTime', nullable: true })
  updateDateTime?: Date | null
}
