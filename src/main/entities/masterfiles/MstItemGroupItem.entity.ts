// CREATE TABLE [dbo].[MstItemGroupItem](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[ItemId] [int] NOT NULL,
// 	[ItemGroupId] [int] NOT NULL,
// )

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstItemEntity } from './MstItem.entity'
import { MstItemGroupEntity } from './MstItemGroup.entity'

@Entity(POSEntity.MST_ITEM_GROUP_ITEM)
export class MstItemGroupItemEntity extends BaseEntity {
  constructor() {
    super()
    this.itemId = 0
    this.itemGroupId = 0
  }

  @Column({ name: 'ItemId', type: 'int', nullable: false })
  itemId: number

  @Column({ name: 'ItemGroupId', type: 'int', nullable: false })
  itemGroupId: number

  // FK Relationships
  @ManyToOne(() => MstItemEntity)
  @JoinColumn({ name: 'ItemId' })
  item?: MstItemEntity

  @ManyToOne(() => MstItemGroupEntity)
  @JoinColumn({ name: 'ItemGroupId' })
  itemGroup?: MstItemGroupEntity
}
