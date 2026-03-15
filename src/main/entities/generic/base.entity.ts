import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { MstUserEntity } from "../masterfiles"

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

  @PrimaryGeneratedColumn({ name: 'Id', type: 'int' })
  id: number

  @Column({ name: 'IsLocked', type: 'bit' })
  isLocked: boolean

  @Column({ name: 'EntryUserId', type: 'int' })
  entryUserId: number

  @CreateDateColumn({ name: 'EntryDateTime', type: 'datetimeoffset' })
  entryDateTime: Date

  @Column({ name: 'UpdateUserId', type: 'int', nullable: true })
  updateUserId?: number | null

  @UpdateDateColumn({ name: 'UpdateDateTime', type: 'datetimeoffset', nullable: true })
  updateDateTime?: Date | null

  // FK Relationships
  @ManyToOne(() => MstUserEntity, (user) => user.id)
  @JoinColumn({ name: 'EntryUserId', referencedColumnName: 'id' })
  entryUser?: MstUserEntity

  @ManyToOne(() => MstUserEntity, (user) => user.id)
  @JoinColumn({ name: 'UpdateUserId', referencedColumnName: 'id' })
  updateUser?: MstUserEntity  
}
