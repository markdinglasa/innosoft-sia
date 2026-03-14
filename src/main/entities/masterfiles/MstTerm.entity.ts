// CREATE TABLE [dbo].[MstTerm](
// 	[Id] [int] IDENTITY(1,1) NOT NULL,
// 	[Term] [nvarchar](50) NOT NULL,
// 	[NumberOfDays] [decimal](18, 5) NOT NULL,

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.MST_TERM)
export class MstTermEntity {
  constructor() {
    this.id = 0
    this.term = ''
    this.numberOfDays = 0
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'Term', type: 'nvarchar', length: 50, nullable: false })
  term: string

  @Column({ name: 'NumberOfDays', type: 'decimal', precision: 18, scale: 5, nullable: false })
  numberOfDays: number
}
