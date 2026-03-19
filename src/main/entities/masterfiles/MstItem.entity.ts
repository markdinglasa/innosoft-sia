

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstAccountEntity } from './MstAccount.entity'
import { MstSupplierEntity } from './MstSupplier.entity'
import { MstTaxEntity } from './MstTax.entity'
import { MstUnitEntity } from './MstUnit.entity'

@Entity(POSEntity.MST_ITEM)
export class MstItemEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.itemCode = ''
    this.barCode = ''
    this.name = ''
    this.description = ''
    this.genericName = ''
    this.category = ''
    this.salesAccountId = 0
    this.assetAccountId = 0
    this.costAccountId = 0
    this.inTaxId = 0
    this.outTaxId = 0
    this.unitId = 0
    this.defaultSupplierId = 0
    this.cost = 0
    this.markUp = 0
    this.price = 0
    this.imagePath = ''
    this.reorderQuantity = 0
    this.onhandQuantity = 0
    this.isInventory = false
    this.isPackage = false
    this.expiryDate = null
  }
  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'ItemCode', type: 'nvarchar', length: 255 })
  itemCode: string

  @Column({ name: 'BarCode', type: 'nvarchar', length: 255 })
  barCode: string

  @Column({ name: 'Name', type: 'nvarchar', length: 255 })
  name: string

  @Column({ name: 'Description', type: 'nvarchar', length: 255 })
  description: string

  @Column({ name: 'GenericName', type: 'nvarchar', length: 255 })
  genericName: string

  @Column({ name: 'Category', type: 'nvarchar', length: 255 })
  category: string

  @Column({ name: 'SalesAccountId', type: 'int' })
  salesAccountId: number

  @Column({ name: 'AssetAccountId', type: 'int' })
  assetAccountId: number

  @Column({ name: 'CostAccountId', type: 'int' })
  costAccountId: number

  @Column({ name: 'InTaxId', type: 'int' })
  inTaxId: number

  @Column({ name: 'OutTaxId', type: 'int' })
  outTaxId: number

  @Column({ name: 'UnitId', type: 'int' })
  unitId: number

  @Column({ name: 'DefaultSupplierId', type: 'int' })
  defaultSupplierId: number

  @Column({ name: 'Cost', type: 'decimal', precision: 18, scale: 5 })
  cost: number

  @Column({ name: 'MarkUp', type: 'decimal', precision: 18, scale: 5 })
  markUp: number

  @Column({ name: 'Price', type: 'decimal', precision: 18, scale: 5 })
  price: number

  @Column({ name: 'ImagePath', type: 'nvarchar', length: 255 })
  imagePath: string

  @Column({ name: 'ReorderQuantity', type: 'decimal', precision: 18, scale: 5 })
  reorderQuantity: number

  @Column({ name: 'OnhandQuantity', type: 'decimal', precision: 18, scale: 5 })
  onhandQuantity: number

  @Column({ name: 'IsInventory', type: 'bit' })
  isInventory: boolean

  @Column({ name: 'ExpiryDate', type: 'datetimeoffset', nullable: true })
  expiryDate?: Date | null

  @Column({ name: 'LotNumber', type: 'nvarchar', length: 50, nullable: true })
  lotNumber?: string | null

  @Column({ name: 'Remarks', type: 'nvarchar', length: 255, nullable: true })
  remarks?: string | null

  @Column({ name: 'DefaultKitchenReport', type: 'varchar', length: 50, nullable: true })
  defaultKitchenReport?: string | null

  @Column({ name: 'IsPackage', type: 'bit' })
  isPackage: boolean

  // FK Relationships
  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'SalesAccountId' })
  salesAccount?: MstAccountEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'AssetAccountId' })
  assetAccount?: MstAccountEntity

  @ManyToOne(() => MstAccountEntity)
  @JoinColumn({ name: 'CostAccountId' })
  costAccount?: MstAccountEntity

  @ManyToOne(() => MstSupplierEntity)
  @JoinColumn({ name: 'DefaultSupplierId' })
  defaultSupplier?: MstSupplierEntity

  @ManyToOne(() => MstTaxEntity)
  @JoinColumn({ name: 'InTaxId' })
  inTax?: MstTaxEntity

  @ManyToOne(() => MstTaxEntity)
  @JoinColumn({ name: 'OutTaxId' })
  outTax?: MstTaxEntity

  @ManyToOne(() => MstUnitEntity)
  @JoinColumn({ name: 'UnitId' })
  unit?: MstUnitEntity


}
