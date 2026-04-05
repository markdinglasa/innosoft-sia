import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic'
import { SysSettingsEntity } from '../utilities'
import { SysUserTerminalEntity } from '../utilities/SysUserTerminal.entity'
import { MstBranchEntity } from './MstBranch.entity'

@Entity(POSEntity.MST_TERMINAL)
export class MstTerminalEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.name = ''
    this.isDefault = false
  }

  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'Name', type: 'nvarchar', length: 50, nullable: false })
  name: string

  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean

  // FK Relationships
  @OneToMany(() => SysUserTerminalEntity, (userTerminal) => userTerminal.terminal)
  userTerminals?: SysUserTerminalEntity[]

  @ManyToOne(() => MstBranchEntity, (branch) => branch.terminals)
  @JoinColumn({ name: 'BranchId' })
  branch?: MstBranchEntity

  @OneToMany(() => SysSettingsEntity, (sysSettings) => sysSettings.terminal)
  sysSettings?: SysSettingsEntity[]
}

