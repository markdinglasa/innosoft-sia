import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from "../generic"
import { MstAccountEntity } from '../masterfiles/MstAccount.entity'
import { MstItemEntity } from '../masterfiles/MstItem.entity'
import { MstUnitEntity } from '../masterfiles/MstUnit.entity'
import { TrnStockOutEntity } from './TrnStockOut.entity'

@Entity(POSEntity.TRN_STOCK_OUT_LINE)
export class TrnStockOutLineEntity extends BaseEntity {
  constructor() {
    super()
    this.stockOutId = 0
    this.itemId = 0
    this.unitId = 0
    this.quantity = 0
    this.cost = 0
    this.amount = 0
    this.assetAccountId = 0
  }

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

  // FK Relationships
  @ManyToOne(() => TrnStockOutEntity)
  @JoinColumn({ name: 'StockOutId' })
  stockOut?: TrnStockOutEntity

  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity

  @ManyToOne(() => MstUnitEntity)
  @JoinColumn({ name: 'UnitId' })
  unit?: MstUnitEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AssetAccountId' })
  assetAccount?: MstAccountEntity
}
