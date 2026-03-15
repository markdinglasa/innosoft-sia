import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.SYS_ORDER_LOCKED)
export class SysOrderLockedEntity {
  constructor() {
    this.id = 0
    this.orderId = 0
    this.userId = 0
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'OrderId', type: 'int', nullable: false })
  orderId: number

  @Column({ name: 'UserId', type: 'int', nullable: false })
  userId: number
}
