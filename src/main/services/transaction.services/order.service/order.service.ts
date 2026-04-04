import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { TrnOrderEntity } from '../../../entities/transactions/TrnOrder.entity'
import { BaseService } from '../../base.service'
import { ShiftService } from '../shift.service'
import { CreateOrderDto, UpdateOrderDto } from './dto'
import socketService from '../../socket.service'
import { SocketChannel } from '@shared/constants'
import { getRepository } from 'typeorm'
import { MstItemEntity } from '../../../entities/masterfiles/MstItem.entity'
import { TrnOrderLineEntity } from '../../../entities/transactions/TrnOrderLine.entity'

/**
 * Interface defining the specific operations for the Order service.
 */
export interface IOrderService {
  // Add any Order-specific methods here if needed
}

const shiftService = new ShiftService()

/**
 * Service handling TrnOrderEntity CRUD and validations.
 */
export class OrderService extends BaseService<TrnOrderEntity> implements IOrderService {
  constructor() {
    super(TrnOrderEntity)
  }

  /**
   * Search fields for Order keyword search.
   */
  protected get searchFields(): string[] {
    return ['orderNumber', 'manualInvoiceNumber', 'remarks', 'seniorCitizenName']
  }

  /**
   * Validates before creating a new Order.
   */
  protected async validateCreate(data: DeepPartial<TrnOrderEntity>): Promise<void> {
    const orderDto = await transformAndValidate(CreateOrderDto, data)
    
    // Check if user is provided for shift verification
    const userId = (data as any).userId || (data as any).preparedById
    const terminalId = (data as any).terminalId

    if (userId && terminalId) {
      await shiftService.verifyActiveShift(userId, terminalId)
    }

    const existing = await this.repository.findOneBy({ orderNumber: orderDto.orderNumber })

    if (existing) {
      throw new BadRequestException(`Order Number '${orderDto.orderNumber}' already exists.`)
    }

    // Perform stock alerts check
    if (data.orderLines && data.orderLines.length > 0) {
      this.checkInventoryAlerts(data.orderLines)
    }
  }

  /**
   * Scans order lines for low stock items and broadcasts alerts.
   */
  private async checkInventoryAlerts(lines: DeepPartial<TrnOrderLineEntity>[]): Promise<void> {
    const itemRepo = getRepository(MstItemEntity)
    
    for (const line of lines) {
      if (!line.itemId) continue
      
      const item = await itemRepo.findOneBy({ id: line.itemId })
      if (item && item.isInventory) {
        const remaining = Number(item.onhandQuantity) - Number(line.quantity)
        if (remaining <= Number(item.reorderQuantity)) {
           socketService.broadcastLocal(SocketChannel.lowStock, {
             itemId: item.id,
             itemName: item.name,
             remaining,
             threshold: item.reorderQuantity
           })
        }
      }
    }
  }

  /**
   * Validates before updating an existing Order.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<TrnOrderEntity>): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Order not found for update.')
    }

    const orderDto = await transformAndValidate(UpdateOrderDto, data)

    if (orderDto.orderNumber && orderDto.orderNumber !== current.orderNumber) {
      const existing = await this.repository.findOneBy({ orderNumber: orderDto.orderNumber })
      if (existing) {
        throw new BadRequestException(`Order Number '${orderDto.orderNumber}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting an Order.
   */
  protected async validateDelete(id: any): Promise<void> {
    const current = await this.get(id)
    if (!current) {
      throw new BadRequestException('Order not found for deletion.')
    }
    
    // Check if it has lines
    if (current.orderLines && current.orderLines.length > 0) {
      throw new BadRequestException('Cannot delete Order because it has associated order lines.')
    }
  }
}
