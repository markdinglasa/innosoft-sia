import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.TRN_STOCK_IN_LINE)
export class TrnStockInLineEntity {
  constructor() {
    this.id = 0
    this.stockInId = 0
    this.itemId = 0
    this.unitId = 0
    this.quantity = 0
    this.cost = 0
    this.amount = 0
    this.expiryDate = null
    this.lotNumber = null
    this.assetAccountId = 0
    this.price = null
    this.markUp = null
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'StockInId', type: 'int', nullable: false })
  stockInId: number

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

  @Column({ name: 'ExpiryDate', type: 'datetime', nullable: true })
  expiryDate: Date | null

  @Column({ name: 'LotNumber', type: 'nvarchar', length: 50, nullable: true })
  lotNumber: string | null

  @Column({ name: 'AssetAccountId', type: 'int', nullable: false })
  assetAccountId: number

  @Column({ name: 'Price', type: 'decimal', precision: 18, scale: 5, nullable: true })
  price: number | null

  @Column({ name: 'MarkUp', type: 'decimal', precision: 18, scale: 5, nullable: true })
  markUp: number | null
}
