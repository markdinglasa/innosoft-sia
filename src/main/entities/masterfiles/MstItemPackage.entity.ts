// CREATE TABLE [dbo].[MstItemPackage](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[ItemId] [int] NOT NULL,
// 	[PackageItemId] [int] NOT NULL,
// 	[UnitId] [int] NOT NULL,
// 	[Quantity] [decimal](18, 5) NOT NULL,
// 	[IsOptional] [bit] NOT NULL,

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstItemEntity } from './MstItem.entity'
import { MstUnitEntity } from './MstUnit.entity'

@Entity(POSEntity.MST_ITEM_PACKAGE)
export class MstItemPackageEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.itemId = 0
    this.packageItemId = 0
    this.unitId = 0
    this.quantity = 0
    this.isOptional = false
  }
  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'PackageItemId', type: 'int', nullable: false })
  packageItemId: number

  @Column({ name: 'UnitId', type: 'int', nullable: false })
  unitId: number

  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 5, nullable: false })
  quantity: number

  @Column({ name: 'IsOptional', type: 'bit', nullable: false })
  isOptional: boolean

  // FK Relationships
  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity

  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'PackageItemId' })
  packageItem?: MstItemEntity

  @ManyToOne(() => MstUnitEntity)
  @JoinColumn({ name: 'UnitId' })
  unit?: MstUnitEntity
}
