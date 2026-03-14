// CREATE TABLE [dbo].[MstUnit](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Unit] [nvarchar](50) NOT NULL,

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.MST_UNIT)
export class MstUnitEntity {
  constructor() {
    this.id = 0
    this.unit = ''
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'Unit', type: 'nvarchar', length: 50, nullable: false })
  unit: string
}
