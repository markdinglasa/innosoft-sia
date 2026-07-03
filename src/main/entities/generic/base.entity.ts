import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export interface IBaseEntity {
  id: number
  isLocked: boolean
  entryUserId: number
  entryDateTime: Date
  updateUserId?: number | null
  updateDateTime?: Date | null
}

export class BaseEntity implements IBaseEntity {
  constructor() {
    this.id = 0
    this.isLocked = false
    this.entryUserId = 0
    this.entryDateTime = new Date()
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'IsLocked', type: 'bit' })
  isLocked: boolean

  @Column({ name: 'EntryUserId', type: 'int' })
  entryUserId: number

  @CreateDateColumn({ name: 'EntryDateTime', type: 'datetime' })
  entryDateTime: Date

  @Column({ name: 'UpdateUserId', type: 'int', nullable: true })
  updateUserId?: number | null

  @UpdateDateColumn({ name: 'UpdateDateTime', type: 'datetime', nullable: true })
  updateDateTime?: Date | null
}
