import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstItemEntity } from '../masterfiles/MstItem.entity'
import { MstSupplierEntity } from '../masterfiles/MstSupplier.entity'

@Entity(POSEntity.MST_SUPPLIER_CATALOG)
export class MstSupplierCatalogEntity extends BaseEntity {
  constructor() {
    super()
    this.supplierId = 0
    this.itemId = 0
    this.supplierItemCode = ''
    this.supplierItemName = ''
    this.unitCost = 0
    this.minimumOrderQuantity = 1
    this.leadTimeDays = 0
    this.isActive = true
    this.lastUpdated = new Date()
    this.supplierItemDescription = null
  }

  @Column({ name: 'SupplierId', type: 'int', nullable: false })
  supplierId: number

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'SupplierItemCode', type: 'nvarchar', length: 100, nullable: false })
  supplierItemCode: string

  @Column({ name: 'SupplierItemName', type: 'nvarchar', length: 255, nullable: false })
  supplierItemName: string

  @Column({ name: 'SupplierItemDescription', type: 'nvarchar', length: 500, nullable: true })
  supplierItemDescription: string | null

  @Column({ name: 'UnitCost', type: 'decimal', precision: 18, scale: 5, nullable: false })
  unitCost: number

  @Column({
    name: 'MinimumOrderQuantity',
    type: 'decimal',
    precision: 18,
    scale: 5,
    nullable: false,
    default: 1
  })
  minimumOrderQuantity: number

  @Column({ name: 'LeadTimeDays', type: 'int', nullable: false, default: 0 })
  leadTimeDays: number

  @Column({ name: 'IsActive', type: 'bit', nullable: false, default: true })
  isActive: boolean

  @Column({ name: 'LastUpdated', type: 'datetimeoffset', nullable: false })
  lastUpdated: Date

  // Relationships
  @ManyToOne(() => MstSupplierEntity)
  @JoinColumn({ name: 'SupplierId' })
  supplier?: MstSupplierEntity

  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity
}

