import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'

@Entity(POSEntity.SYS_FORM)
export class SysFormEntity {
  constructor() {
    this.form = ''
    this.formDescription = ''
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id!: number

  @Column({ name: 'Form', type: 'nvarchar', length: 50, nullable: false })
  form: string

  @Column({ name: 'FormDescription', type: 'nvarchar', length: 100, nullable: false })
  formDescription: string
}
