import { Column, Entity, OneToMany } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic'
import { SysSettingsEntity } from "../utilities"
import { SysUserTerminalEntity } from '../utilities/SysUserTerminal.entity'

@Entity(POSEntity.MST_TERMINAL)
export class MstTerminalEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.name = ''
    this.recNumber = ''
    this.physicalAddress = ''
    this.isDefault = false
  }

  @Column({ name: 'RecNumber', type: 'nvarchar', length: 50, nullable: false })
  recNumber: string

  @Column({ name: 'PhysicalAddress', type: 'nvarchar', length: 255, nullable: true })
  physicalAddress: string
    @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'Name', type: 'nvarchar', length: 50, nullable: false })
  name: string

  @Column({ name: 'IsDefault', type: 'bit', nullable: false })
  isDefault: boolean

  // FK RElationship
  @OneToMany(() => SysUserTerminalEntity, (userTerminal) => userTerminal.terminal)
  userTerminals?: SysUserTerminalEntity[] 

  @OneToMany(() => SysSettingsEntity, (sysSettings) => sysSettings.terminal)
  sysSettings?: SysSettingsEntity[]
}
