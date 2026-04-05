import { Column, Entity, OneToMany } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstBranchAccessEntity } from './MstBranchAccess.entity'
import { MstTerminalEntity } from './MstTerminal.entity'

@Entity(POSEntity.MST_BRANCH)
export class MstBranchEntity extends BaseEntity {
  constructor() {
    super()
    this.name = ''
    this.address = ''
    this.description = null
    this.isDefault = false
  }

  @Column({ name: 'Name', type: 'nvarchar', length: 250 })
  name: string

  @Column({ name: 'Address', type: 'text', nullable: true })
  address: string

  @Column({ name: 'Description', type: 'text', nullable: true })
  description: string | null

  @Column({ name: 'IsDefault', type: 'tinyint', nullable: false })
  isDefault: boolean

  @OneToMany(() => MstBranchAccessEntity, (branchAccess) => branchAccess.branch)
  branchAccesses?: MstBranchAccessEntity[]

  @OneToMany(() => MstTerminalEntity, (terminal) => terminal.branch)
  terminals?: MstTerminalEntity[]
}
