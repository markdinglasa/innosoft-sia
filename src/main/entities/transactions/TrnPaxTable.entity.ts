import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.TRN_PAX_TABLE)
export class TrnPaxTableEntity {
  constructor() {
    this.id = 0
    this.orderId = 0
    this.totalPax = 0
    this.discountedPax = 0
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'OrderId', type: 'int', nullable: false })
  orderId: number

  @Column({ name: 'TotalPax', type: 'decimal', precision: 18, scale: 5, nullable: false })
  totalPax: number

  @Column({ name: 'DiscountedPax', type: 'decimal', precision: 18, scale: 5, nullable: false })
  discountedPax: number
}
