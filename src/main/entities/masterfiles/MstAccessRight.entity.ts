import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { POSEntity } from '../entity-names'
import { MstPermissionsEntity } from './MstPermissions.entity'

@Entity(POSEntity.MST_ACCESS_RIGHT)
export class MstAccessRightEntity {
  constructor() {
    this.id = 0
    this.action = ''
    this.permissions = []
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number

  @Column({ name: 'Action', type: 'nvarchar', length: 255, nullable: false })
  action: string

  // FK Relationships
  @OneToMany(() => MstPermissionsEntity, (permission) => permission.accessRight)
  permissions: MstPermissionsEntity[]
}
