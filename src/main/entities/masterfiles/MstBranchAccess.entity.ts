import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstBranchEntity } from './MstBranch.entity'
import { MstUserEntity } from './MstUser.entity'

@Entity(POSEntity.MST_BRANCH_ACCESS)
export class MstBranchAccessEntity extends BaseEntity {
  constructor() {
    super()
    this.branchId = 0
    this.userId = 0
  }

  @Column({ name: 'BranchId', type: 'int', nullable: false })
  branchId: number

  @Column({ name: 'UserId', type: 'int', nullable: false })
  userId: number

  // FK Relationships
  @ManyToOne(() => MstBranchEntity, (branch) => branch.branchAccesses)
  @JoinColumn({ name: 'BranchId' })
  branch?: MstBranchEntity

  @ManyToOne(() => MstUserEntity, (user) => user.branchAccesses)
  @JoinColumn({ name: 'UserId' })
  user?: MstUserEntity
}