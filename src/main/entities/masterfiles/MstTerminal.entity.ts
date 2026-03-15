import { Column, Entity, OneToMany } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic'
import { SysSettingsEntity } from "../utilities"
import { SysUserTerminalEntity } from '../utilities/SysUserTerminal.entity'

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

  // FK RElationship
  @OneToMany(() => SysUserTerminalEntity, (userTerminal) => userTerminal.terminal)
  userTerminals?: SysUserTerminalEntity[] 

  @OneToMany(() => SysSettingsEntity, (sysSettings) => sysSettings.terminal)
  sysSettings?: SysSettingsEntity[]
}
