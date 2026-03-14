// CREATE TABLE [dbo].[MstItemComponent](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[ItemId] [int] NOT NULL,
// 	[ComponentItemId] [int] NOT NULL,
// 	[UnitId] [int] NOT NULL,
// 	[Quantity] [decimal](18, 5) NOT NULL,
// 	[Cost] [decimal](18, 5) NOT NULL,
// 	[Amount] [decimal](18, 5) NOT NULL,
// 	[IsPrinted] [bit] NOT NULL,

import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_ITEM_COMPONENT)
export class MstItemComponentEntity extends BaseEntity {
  constructor() {
    super()
    this.itemId = ''
  }

  @Column({ name: 'ItemId', type: 'nvarchar' })
  itemId: string
}
