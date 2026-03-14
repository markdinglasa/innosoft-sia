import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.SYS_SALES_LOCKED)
export class SysSalesLockedEntity {
  constructor() {
    this.id = 0
    this.salesId = 0
    this.userId = 0
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'SalesId', type: 'int', nullable: false })
  salesId: number

  @Column({ name: 'UserId', type: 'int', nullable: false })
  userId: number
}
