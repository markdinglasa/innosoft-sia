import {
  LineItemStatus,
  PurchaseOrderStatus,
  ReceivingStatus
} from '@shared/types/purchase-order.types'
import { BadRequestException } from '../../../common/exceptions'
import { TrnPurchaseOrderEntity } from '../../../entities/transactions/TrnPurchaseOrder.entity'
import { TrnPurchaseOrderReceivingEntity } from '../../../entities/transactions/TrnPurchaseOrderReceiving.entity'
import { TrnPurchaseOrderReceivingLineEntity } from '../../../entities/transactions/TrnPurchaseOrderReceivingLine.entity'
import { TrnStockInEntity } from '../../../entities/transactions/TrnStockIn.entity'
import { TrnStockInLineEntity } from '../../../entities/transactions/TrnStockInLine.entity'
import { AppDataSource } from '../../../typeORM/configurations'
import { BaseService } from '../../base.service'

export class PurchaseOrderReceivingService extends BaseService<TrnPurchaseOrderReceivingEntity> {
  constructor() {
    super(TrnPurchaseOrderReceivingEntity)
  }

  /**
   * Processes a receiving transaction for a Purchase Order.
   * Updates PO lines and automatically creates a StockIn record.
   */
  async processReceiving(
    purchaseOrderId: number,
    receivedBy: number,
    receivingData: {
      receivingNumber: string
      deliveryNote?: string
      notes?: string
      items: { itemId: number; unitId: number; quantity: number; remarks?: string }[]
    }
  ): Promise<void> {
    await AppDataSource.transaction(async (manager) => {
      // 1. Fetch Purchase Order and its lines
      const poRepo = manager.getRepository(TrnPurchaseOrderEntity)
      const po = await poRepo.findOne({
        where: { id: purchaseOrderId },
        relations: ['lineItems']
      })

      if (!po) throw new BadRequestException('Purchase Order not found.')
      if (
        po.status !== PurchaseOrderStatus.APPROVED &&
        po.status !== PurchaseOrderStatus.PARTIALLY_RECEIVED
      ) {
        throw new BadRequestException(
          `Cannot receive items for Purchase Order in status '${po.status}'.`
        )
      }

      // 2. Create Receiving Transaction Record
      const receiving = manager.create(TrnPurchaseOrderReceivingEntity, {
        purchaseOrderId,
        receivingNumber: receivingData.receivingNumber,
        receivingDate: new Date(),
        receivedBy,
        deliveryNote: receivingData.deliveryNote,
        notes: receivingData.notes,
        status: ReceivingStatus.COMPLETE
      })
      const savedReceiving = await manager.save(receiving)

      // 3. Create Receiving Lines and Update PO Lines
      const receivingLines: TrnPurchaseOrderReceivingLineEntity[] = []
      let allItemsReceived = true

      for (const itemData of receivingData.items) {
        const poLine = po.lineItems?.find(
          (l) => l.itemId === itemData.itemId && l.unitId === itemData.unitId
        )
        if (!poLine) continue

        // Record receiving line
        const recLine = manager.create(TrnPurchaseOrderReceivingLineEntity, {
          receivingId: savedReceiving.id,
          itemId: itemData.itemId,
          unitId: itemData.unitId,
          quantity: itemData.quantity,
          remarks: itemData.remarks
        })
        receivingLines.push(recLine)

        // Update PO line received quantity
        poLine.receivedQuantity = (poLine.receivedQuantity || 0) + itemData.quantity
        poLine.remainingQuantity = poLine.quantity - poLine.receivedQuantity

        if (poLine.remainingQuantity <= 0) {
          poLine.status = LineItemStatus.RECEIVED
        } else {
          poLine.status = LineItemStatus.PARTIALLY_RECEIVED
          allItemsReceived = false
        }
        await manager.save(poLine)
      }

      await manager.save(receivingLines)

      // 4. Update PO Status
      po.status = allItemsReceived
        ? PurchaseOrderStatus.COMPLETED
        : PurchaseOrderStatus.PARTIALLY_RECEIVED
      po.actualDeliveryDate = new Date()
      await manager.save(po)

      // 5. AUTO-CREATE STOCK-IN RECORD
      const stockInRepo = manager.getRepository(TrnStockInEntity)
      const stockIn = stockInRepo.create({
        branchId: po.branchId,
        periodId: po.periodId,
        stockInDate: new Date(),
        stockInNumber: `SI-RCV-${receivingData.receivingNumber}`,
        supplierId: po.supplierId,
        remarks: `Auto-generated from PO Receiving: ${receivingData.receivingNumber}`,
        isReturn: false,
        purchaseOrderId: po.id,
        preparedBy: receivedBy,
        checkedBy: receivedBy,
        approvedBy: receivedBy
      })
      const savedStockIn = await manager.save(stockIn)

      // Create StockIn Lines
      for (const itemData of receivingData.items) {
        const poLine = po.lineItems?.find((l) => l.itemId === itemData.itemId)

        const stockInLine = manager.create(TrnStockInLineEntity, {
          stockInId: savedStockIn.id,
          itemId: itemData.itemId,
          unitId: itemData.unitId,
          quantity: itemData.quantity,
          cost: poLine?.unitCost || 0,
          amount: (poLine?.unitCost || 0) * itemData.quantity,
          assetAccountId: 0 // In a real system, we'd fetch this from the item entity
        })
        await manager.save(stockInLine)
      }
    })
  }
}

