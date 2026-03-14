import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.TRN_STOCK_OUT_LLINE)
export class TrnStockOutLineEntity {
  constructor() {
    this.id = 0
    this.stockOutId = 0
    this.itemId = 0
    this.unitId = 0
    this.quantity = 0
    this.cost = 0
    this.amount = 0
    this.assetAccountId = 0
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'StockOutId', type: 'int', nullable: false })
  stockOutId: number

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'UnitId', type: 'int', nullable: false })
  unitId: number

  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 5, nullable: false })
  quantity: number

  @Column({ name: 'Cost', type: 'decimal', precision: 18, scale: 5, nullable: false })
  cost: number

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

  @Column({ name: 'AssetAccountId', type: 'int', nullable: false })
  assetAccountId: number
}
