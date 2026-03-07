// import { Column, PrimaryGeneratedColumn } from 'typeorm'

// export interface IBaseEntity {
//   id: number
//   isLocked: boolean
//   entryUserId: number
//   entryDateTime: Date
//   updateUserId?: number | null
//   updateDateTime?: Date | null
// }

// export class BaseEntity implements IBaseEntity {
//   @PrimaryGeneratedColumn({ name: 'Id' })
//   id!: number

//   @Column({ name: 'IsLocked', type: 'bit' })
//   isLocked!: boolean

//   @Column({ name: 'EntryUserId', type: 'int' })
//   entryUserId!: number

//   @Column({ name: 'EntryDateTime', type: 'datetime' })
//   entryDateTime!: Date

//   @Column({ name: 'UpdateUserId', type: 'int', nullable: true })
//   updateUserId?: number | null

//   @Column({ name: 'UpdateDateTime', type: 'datetime', nullable: true })
//   updateDateTime?: Date
// }
