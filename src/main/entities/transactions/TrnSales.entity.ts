import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../generic/base.entity'

@Entity('TrnSales')
export class TrnSalesEntity extends BaseEntity {
  @Column({ type: 'nvarchar', length: 50, nullable: true })
  CustomerCode!: string

  @Column({ type: 'int', nullable: true })
  Pax!: number

  @Column({ type: 'int' })
  TableStatus!: number

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  ChildName!: string

  @Column({ type: 'datetime', nullable: true })
  DateOfBirth!: Date

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  TINNumber!: string

  @Column({ type: 'bit' })
  IsBilledOut!: boolean
}
