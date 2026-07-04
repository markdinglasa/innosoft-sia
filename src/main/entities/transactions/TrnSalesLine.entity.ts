import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'
import { TrnSalesEntity } from './TrnSales.entity'
import { MstItemEntity } from '../masterfiles/MstItem.entity'
import { MstUnitEntity } from '../masterfiles/MstUnit.entity'
import { MstDiscountEntity } from '../masterfiles/MstDiscount.entity'
import { MstTaxEntity } from '../masterfiles/MstTax.entity'
import { MstAccountEntity } from '../masterfiles/MstAccount.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'

@Entity(POSEntity.TRN_SALES_LINE)
export class TrnSalesLineEntity {
  constructor() {
    this.id = 0
    this.salesId = 0
    this.itemId = 0
    this.unitId = 0
    this.price = 0
    this.discountId = 0
    this.discountRate = 0
    this.discountAmount = 0
    this.netPrice = 0
    this.quantity = 0
    this.amount = 0
    this.taxId = 0
    this.taxRate = 0
    this.taxAmount = 0
    this.salesAccountId = 0
    this.assetAccountId = 0
    this.costAccountId = 0
    this.taxAccountId = 0
    this.salesLineTimeStamp = new Date()
    this.userId = null
    this.preparation = null
    this.price1 = 0
    this.price2 = 0
    this.price2LessTax = 0
    this.priceSplitPercentage = 0
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'SalesId', type: 'int', nullable: false })
  salesId: number

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'UnitId', type: 'int', nullable: false })
  unitId: number

  @Column({ name: 'Price', type: 'decimal', precision: 18, scale: 5, nullable: false })
  price: number

  @Column({ name: 'DiscountId', type: 'int', nullable: false })
  discountId: number

  @Column({ name: 'DiscountRate', type: 'decimal', precision: 18, scale: 5, nullable: false })
  discountRate: number

  @Column({ name: 'DiscountAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  discountAmount: number

  @Column({ name: 'NetPrice', type: 'decimal', precision: 18, scale: 5, nullable: false })
  netPrice: number

  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 5, nullable: false })
  quantity: number

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  amount: number

  @Column({ name: 'TaxId', type: 'int', nullable: false })
  taxId: number

  @Column({ name: 'TaxRate', type: 'decimal', precision: 18, scale: 5, nullable: false })
  taxRate: number

  @Column({ name: 'TaxAmount', type: 'decimal', precision: 18, scale: 5, nullable: false })
  taxAmount: number

  @Column({ name: 'SalesAccountId', type: 'int', nullable: false })
  salesAccountId: number

  @Column({ name: 'AssetAccountId', type: 'int', nullable: false })
  assetAccountId: number

  @Column({ name: 'CostAccountId', type: 'int', nullable: false })
  costAccountId: number

  @Column({ name: 'TaxAccountId', type: 'int', nullable: false })
  taxAccountId: number

  @Column({ name: 'SalesLineTimeStamp', type: 'datetime', nullable: false })
  salesLineTimeStamp: Date

  @Column({ name: 'UserId', type: 'int', nullable: true })
  userId: number | null

  @Column({ name: 'Preparation', type: 'varchar', length: 255, nullable: true })
  preparation: string | null

  @Column({ name: 'Price1', type: 'decimal', precision: 18, scale: 5, nullable: false })
  price1: number

  @Column({ name: 'Price2', type: 'decimal', precision: 18, scale: 5, nullable: false })
  price2: number

  @Column({ name: 'Price2LessTax', type: 'decimal', precision: 18, scale: 5, nullable: false })
  price2LessTax: number

  @Column({
    name: 'PriceSplitPercentage',
    type: 'decimal',
    precision: 18,
    scale: 5,
    nullable: false
  })
  priceSplitPercentage: number

  // FK Relationships
  @ManyToOne(() => TrnSalesEntity)
  @JoinColumn({ name: 'SalesId' })
  sales?: TrnSalesEntity

  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity

  @ManyToOne(() => MstUnitEntity)
  @JoinColumn({ name: 'UnitId' })
  unit?: MstUnitEntity

  @ManyToOne(() => MstDiscountEntity)
  @JoinColumn({ name: 'DiscountId' })
  discount?: MstDiscountEntity

  @ManyToOne(() => MstTaxEntity)
  @JoinColumn({ name: 'TaxId' })
  tax?: MstTaxEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'SalesAccountId' })
  salesAccount?: MstAccountEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AssetAccountId' })
  assetAccount?: MstAccountEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'CostAccountId' })
  costAccount?: MstAccountEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'TaxAccountId' })
  taxAccount?: MstAccountEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'UserId' })
  user?: MstUserEntity
}
