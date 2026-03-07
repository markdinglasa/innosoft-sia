import { Entity, Column } from 'typeorm'
import { BaseEntity } from '../generic/base.entity'

@Entity('SysSalesLocked')
export class SysSalesLockedEntity extends BaseEntity {
  @Column({ type: 'int' })
  SalesId!: number

  @Column({ type: 'int' })
  UserId!: number
}
