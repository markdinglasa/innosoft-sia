import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ApprovalStatus } from '../../../shared/types/purchase-order.types'
import { POSEntity } from '../entity-names'
import { BaseEntity } from '../generic/base.entity'
import { MstUserEntity } from '../masterfiles/MstUser.entity'
import { TrnPurchaseOrderEntity } from './TrnPurchaseOrder.entity'

@Entity(POSEntity.TRN_PURCHASE_ORDER_APPROVAL)
export class TrnPurchaseOrderApprovalEntity extends BaseEntity {
  constructor() {
    super()
    this.purchaseOrderId = 0
    this.approvalLevel = 0
    this.approverId = 0
    this.status = ApprovalStatus.PENDING
    this.approvalDate = null
    this.comments = null
    this.rejectionReason = null
  }

  @Column({ name: 'PurchaseOrderId', type: 'int', nullable: false })
  purchaseOrderId: number

  @Column({ name: 'ApprovalLevel', type: 'int', nullable: false })
  approvalLevel: number

  @Column({ name: 'ApproverId', type: 'int', nullable: false })
  approverId: number

  @Column({ name: 'ApprovalDate', type: 'datetimeoffset', nullable: true })
  approvalDate: Date | null

  @Column({
    name: 'Status',
    type: 'nvarchar',
    length: 50,
    nullable: false,
    default: ApprovalStatus.PENDING
  })
  status: ApprovalStatus

  @Column({ name: 'Comments', type: 'nvarchar', length: 1000, nullable: true })
  comments: string | null

  @Column({ name: 'RejectionReason', type: 'nvarchar', length: 500, nullable: true })
  rejectionReason: string | null

  // Relationships
  @ManyToOne(() => TrnPurchaseOrderEntity, (po) => po.approvals)
  @JoinColumn({ name: 'PurchaseOrderId' })
  purchaseOrder?: TrnPurchaseOrderEntity

  @ManyToOne(() => MstUserEntity)
  @JoinColumn({ name: 'ApproverId' })
  approver?: MstUserEntity
}

