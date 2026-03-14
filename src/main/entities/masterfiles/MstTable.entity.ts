// CREATE TABLE [dbo].[MstTable](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[TableCode] [nvarchar](50) NOT NULL,
// 	[TableGroupId] [int] NOT NULL,
// 	[TopLocation] [int] NULL,
// 	[LeftLocation] [int] NULL,

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.MST_TABLE)
export class MstTableEntity {
  constructor() {
    this.id = 0
    this.tableCode = ''
    this.tableGroupId = 0
    this.topLocation = null
    this.leftLocation = null
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'TableCode', type: 'nvarchar', length: 50, nullable: false })
  tableCode: string

  @Column({ name: 'TableGroupId', type: 'int', nullable: false })
  tableGroupId: number

  @Column({ name: 'TopLocation', type: 'int', nullable: true })
  topLocation: number | null

  @Column({ name: 'LeftLocation', type: 'int', nullable: true })
  leftLocation: number | null
}
