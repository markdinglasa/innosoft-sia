// CREATE TABLE [dbo].[MstTerminal](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Terminal] [nvarchar](50) NOT NULL,

import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic'

@Entity(POSEntity.MST_TERMINAL)
export class MstTerminalEntity extends BaseEntity {
  constructor() {
    super()
    this.terminal = ''
    this.isDefault = false
  }

  @Column({ name: 'Terminal', type: 'nvarchar', length: 50, nullable: false })
  terminal: string

  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean
}
