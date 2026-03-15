import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstTerminalEntity } from '../masterfiles/MstTerminal.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'

@Entity(POSEntity.SYS_USER_TERMINAL)
export class SysUserTerminalEntity extends BaseEntity {
  constructor() {
    super()
    this.userId = 0
    this.terminalId = 0
  }

  @Column({ name: 'UserId', type: 'int', nullable: false })
  userId: number

  @Column({ name: 'TerminalId', type: 'int', nullable: false })
  terminalId: number

  //FK RElationship
  @ManyToOne(() => MstUserEntity, (user) => user.userTerminals)
  @JoinColumn({ name: 'UserId' })
  user?: MstUserEntity

  @ManyToOne(() => MstTerminalEntity, (terminal) => terminal.userTerminals)
  @JoinColumn({ name: 'TerminalId' })
  terminal?: MstTerminalEntity
}
