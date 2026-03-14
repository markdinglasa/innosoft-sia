// CREATE TABLE [dbo].[MstItemComponent](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[ItemId] [int] NOT NULL,
// 	[ComponentItemId] [int] NOT NULL,
// 	[UnitId] [int] NOT NULL,
// 	[Quantity] [decimal](18, 5) NOT NULL,
// 	[Cost] [decimal](18, 5) NOT NULL,
// 	[Amount] [decimal](18, 5) NOT NULL,
// 	[IsPrinted] [bit] NOT NULL,

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstItemEntity } from './MstItem.entity'
import { MstUnitEntity } from './MstUnit.entity'

@Entity(POSEntity.MST_ITEM_COMPONENT)
export class MstItemComponentEntity extends BaseEntity {
  constructor() {
    super()
    this.itemId = 0
    this.componentItemId = 0
    this.unitId = 0
    this.quantity = 0
    this.cost = 0
    this.amount = 0
    this.isPrinted = false
  }

  @Column({ name: 'ItemId', type: 'int' })
  itemId: number

  @Column({ name: 'ComponentItemId', type: 'int' })
  componentItemId: number

  @Column({ name: 'UnitId', type: 'int' })
  unitId: number

  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 5 })
  quantity: number

  @Column({ name: 'Cost', type: 'decimal', precision: 18, scale: 5 })
  cost: number

  @Column({ name: 'Amount', type: 'decimal', precision: 18, scale: 5 })
  amount: number

  @Column({ name: 'IsPrinted', type: 'bit' })
  isPrinted: boolean

  // FK Relationships
  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity

  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ComponentItemId' })
  componentItem?: MstItemEntity

  @ManyToOne(() => MstUnitEntity)
  @JoinColumn({ name: 'UnitId' })
  unit?: MstUnitEntity
}
