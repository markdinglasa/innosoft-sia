// REATE TABLE [dbo].[MstItem](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[ItemCode] [nvarchar](255) NOT NULL,
// 	[BarCode] [nvarchar](255) NOT NULL,
// 	[ItemDescription] [nvarchar](255) NOT NULL,
// 	[Alias] [nvarchar](255) NOT NULL,
// 	[GenericName] [nvarchar](255) NOT NULL,
// 	[Category] [nvarchar](255) NOT NULL,
// 	[SalesAccountId] [int] NOT NULL,
// 	[AssetAccountId] [int] NOT NULL,
// 	[CostAccountId] [int] NOT NULL,
// 	[InTaxId] [int] NOT NULL,
// 	[OutTaxId] [int] NOT NULL,
// 	[UnitId] [int] NOT NULL,
// 	[DefaultSupplierId] [int] NOT NULL,
// 	[Cost] [decimal](18, 5) NOT NULL,
// 	[MarkUp] [decimal](18, 5) NOT NULL,
// 	[Price] [decimal](18, 5) NOT NULL,
// 	[ImagePath] [nvarchar](255) NOT NULL,
// 	[ReorderQuantity] [decimal](18, 5) NOT NULL,
// 	[OnhandQuantity] [decimal](18, 5) NOT NULL,
// 	[IsInventory] [bit] NOT NULL,
// 	[ExpiryDate] [datetime] NULL,
// 	[LotNumber] [nvarchar](50) NULL,
// 	[Remarks] [nvarchar](255) NULL,
// 	[EntryUserId] [int] NOT NULL,
// 	[EntryDateTime] [datetime] NOT NULL,
// 	[UpdateUserId] [int] NOT NULL,
// 	[UpdateDateTime] [datetime] NOT NULL,
// 	[IsLocked] [bit] NOT NULL,
// 	[DefaultKitchenReport] [varchar](50) NULL,
// 	[IsPackage] [bit] NOT NULL,

import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.MST_ITEM)
export class MstItemEntity extends BaseEntity {
  constructor() {
    super()
    this.itemCode = ''
  }

  @Column({ name: 'ItemCode', type: 'nvarchar', length: 255 })
  itemCode: string
}
