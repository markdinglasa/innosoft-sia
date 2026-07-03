// CREATE TABLE [dbo].[MstTerminal](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Terminal] [nvarchar](50) NOT NULL,

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.MST_TERMINAL)
export class MstTerminalEntity {
  constructor() {
    this.id = 0
    this.terminal = ''
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'Terminal', type: 'nvarchar', length: 50, nullable: false })
  terminal: string
}
