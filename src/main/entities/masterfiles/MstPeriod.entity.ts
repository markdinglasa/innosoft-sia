// CREATE TABLE [dbo].[MstPeriod](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Period] [nvarchar](50) NOT NULL,

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.MST_PERIOD)
export class MstPeriodEntity {
  constructor() {
    this.id = 0
    this.period = ''
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'Period', type: 'nvarchar', length: 50, nullable: false })
  period: string
}
