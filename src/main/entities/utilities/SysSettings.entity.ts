import { Column, Entity } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'

@Entity(POSEntity.SYS_SETTINGS)
export class SysSettingsEntity extends BaseEntity {
  constructor() {
    super()
    this.branchCode = ''
    this.userCode = ''
  }

  @Column({ name: 'BranchCode', type: 'nvarchar', length: 50, nullable: false })
  branchCode: string

  @Column({ name: 'UserCode', type: 'nvarchar', length: 50, nullable: false })
  userCode: string
}
