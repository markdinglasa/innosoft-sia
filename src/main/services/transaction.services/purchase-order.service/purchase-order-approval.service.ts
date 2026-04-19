import { ApprovalStatus, PurchaseOrderStatus } from '@shared/types/purchase-order.types'
import { BadRequestException } from '../../../common/exceptions'
import { TrnPurchaseOrderApprovalEntity } from '../../../entities/transactions/TrnPurchaseOrderApproval.entity'
import { BaseService } from '../../base.service'
import { SysSettingsService } from '../../utility.services/sys-settings.service/sys-settings.service'
import { PurchaseOrderService } from './purchase-order.service'

export class PurchaseOrderApprovalService extends BaseService<TrnPurchaseOrderApprovalEntity> {
  private readonly poService: PurchaseOrderService
  private readonly settingsService: SysSettingsService

  constructor() {
    super(TrnPurchaseOrderApprovalEntity)
    this.poService = new PurchaseOrderService()
    this.settingsService = new SysSettingsService()
  }

  /**
   * Approves a purchase order.
   * Checks against configurable threshold from settings.
   */
  async approve(purchaseOrderId: number, approverId: number, comments?: string): Promise<void> {
    const po = await this.poService.get(purchaseOrderId)
    if (!po) throw new BadRequestException('Purchase Order not found.')

    if (po.status !== PurchaseOrderStatus.PENDING_APPROVAL) {
      throw new BadRequestException(`Cannot approve Purchase Order in status '${po.status}'.`)
    }

    // Check threshold from settings
    // For now, let's assume terminalId 0 for global settings if not specified
    const settings = await this.settingsService.getMergedSettings(0)
    const threshold = settings.purchaseOrderApprovalThreshold || 0

    // Simple logic: if PO amount is above threshold, it needs final manager approval.
    // This is a placeholder for more complex role-based routing.
    if (po.totalAmount > threshold) {
      // In a real system, we'd check if the approver has the 'POS Manager' role
      // For now, we'll record the approval level.
      po.approvalLevel += 1
    }

    // Record the approval
    const approval = this.repository.create({
      purchaseOrderId,
      approverId,
      approvalDate: new Date(),
      status: ApprovalStatus.APPROVED,
      comments: comments || 'Approved via system.',
      approvalLevel: po.approvalLevel
    })
    await this.repository.save(approval)

    // Update PO status if all levels met (simplified to 1 level for now)
    po.status = PurchaseOrderStatus.APPROVED
    po.approvedBy = approverId
    await this.poService.update(po.id, po as any, approverId)
  }

  /**
   * Rejects a purchase order.
   */
  async reject(purchaseOrderId: number, approverId: number, reason: string): Promise<void> {
    const po = await this.poService.get(purchaseOrderId)
    if (!po) throw new BadRequestException('Purchase Order not found.')

    if (po.status !== PurchaseOrderStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Can only reject orders pending approval.')
    }

    const approval = this.repository.create({
      purchaseOrderId,
      approverId,
      approvalDate: new Date(),
      status: ApprovalStatus.REJECTED,
      rejectionReason: reason,
      comments: reason
    })
    await this.repository.save(approval)

    po.status = PurchaseOrderStatus.REJECTED
    await this.poService.update(po.id, po as any, approverId)
  }
}

