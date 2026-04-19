import { PurchaseOrderStatus } from '@shared/types/purchase-order.types'
import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnPurchaseOrderEntity } from '../../../entities/transactions/TrnPurchaseOrder.entity'
import { BaseService } from '../../base.service'
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './dto'

/**
 * Interface defining the specific operations for the PurchaseOrder service.
 */
export interface IPurchaseOrderService {
  calculateTotals(po: TrnPurchaseOrderEntity): void
  submitForApproval(id: number): Promise<void>
}

/**
 * Service handling TrnPurchaseOrderEntity CRUD and validations.
 */
export class PurchaseOrderService
  extends BaseService<TrnPurchaseOrderEntity>
  implements IPurchaseOrderService
{
  constructor() {
    super(TrnPurchaseOrderEntity)
  }

  /**
   * Search fields for PurchaseOrder keyword search.
   */
  protected get searchFields(): string[] {
    return ['purchaseOrderNumber', 'remarks']
  }

  /**
   * Relations to include in list and get results.
   */
  protected get listRelations(): string[] {
    return ['supplier', 'preparedByUser', 'lineItems', 'lineItems.item', 'lineItems.unit']
  }

  /**
   * Calculates totals for a purchase order based on its line items.
   */
  public calculateTotals(po: TrnPurchaseOrderEntity): void {
    if (!po.lineItems || po.lineItems.length === 0) {
      po.amount = 0
      po.totalAmount = 0
      po.taxAmount = 0
      po.discountAmount = 0
      return
    }

    let subtotal = 0
    let totalTax = 0
    let totalDiscount = 0

    po.lineItems.forEach((line, index) => {
      line.lineNumber = index + 1
      line.unitCost = line.unitCost || 0
      line.quantity = line.quantity || 0

      const lineSubtotal = line.unitCost * line.quantity
      line.totalCost = lineSubtotal

      const lineTax = lineSubtotal * ((line.taxRate || 0) / 100)
      line.taxAmount = lineTax

      const lineDiscount = lineSubtotal * ((line.discountRate || 0) / 100)
      line.discountAmount = lineDiscount

      subtotal += lineSubtotal
      totalTax += lineTax
      totalDiscount += lineDiscount

      // Legacy compatibility for 'amount' and 'cost' fields if still used by components
      line.cost = line.unitCost
      line.amount = lineSubtotal
    })

    po.amount = subtotal
    po.taxAmount = totalTax
    po.discountAmount = totalDiscount
    po.totalAmount = subtotal + totalTax - totalDiscount + (po.shippingAmount || 0)
  }

  /**
   * Validates before creating a new PurchaseOrder.
   */
  protected async validateCreate(data: DeepPartial<TrnPurchaseOrderEntity>): Promise<void> {
    const dto = await transformAndValidate(CreatePurchaseOrderDto, data)

    const existing = await this.repository.findOneBy({
      purchaseOrderNumber: dto.purchaseOrderNumber
    })
    if (existing) {
      throw new BadRequestException(
        `Purchase Order Number '${dto.purchaseOrderNumber}' already exists.`
      )
    }

    // Set defaults and calculate totals
    const entity = data as TrnPurchaseOrderEntity
    entity.status = PurchaseOrderStatus.DRAFT
    entity.version = 1
    this.calculateTotals(entity)
  }

  /**
   * Validates before updating an existing PurchaseOrder.
   */
  protected async validateUpdate(
    id: any,
    data: QueryDeepPartialEntity<TrnPurchaseOrderEntity>
  ): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Purchase Order not found for update.')
    }

    if (current.status !== PurchaseOrderStatus.DRAFT) {
      throw new BadRequestException(
        `Cannot update Purchase Order with status '${current.status}'. Only Drafts can be modified.`
      )
    }

    const dto = await transformAndValidate(UpdatePurchaseOrderDto, data)

    if (dto.purchaseOrderNumber && dto.purchaseOrderNumber !== current.purchaseOrderNumber) {
      const existing = await this.repository.findOneBy({
        purchaseOrderNumber: dto.purchaseOrderNumber
      })
      if (existing) {
        throw new BadRequestException(
          `Purchase Order Number '${dto.purchaseOrderNumber}' already exists.`
        )
      }
    }

    // Update version and recalculate totals if line items provided in partial data
    // Note: Partially updating relations in QueryDeepPartialEntity is complex in TypeORM repository.update.
    // BaseService uses repository.update which doesn't handle relations deeply.
    // For complex updates with relations, we might need to override the update method.
  }

  /**
   * Submits a purchase order for approval.
   */
  public async submitForApproval(id: number): Promise<void> {
    const po = await this.get(id)
    if (!po) throw new BadRequestException('Purchase Order not found.')
    if (po.status !== PurchaseOrderStatus.DRAFT) {
      throw new BadRequestException('Only Draft purchase orders can be submitted for approval.')
    }

    po.status = PurchaseOrderStatus.PENDING_APPROVAL
    await this.repository.save(po)

    // Logic for triggering approval workflow notifications will go here
  }

  /**
   * Validates before deleting a PurchaseOrder.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Purchase Order not found for deletion.')
    }

    if (current.status !== PurchaseOrderStatus.DRAFT) {
      throw new BadRequestException(`Cannot delete Purchase Order with status '${current.status}'.`)
    }
  }
}

