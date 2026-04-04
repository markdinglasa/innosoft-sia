import { ipcMain } from 'electron'
import { IpcChannel } from '../../shared/types'
import { OrderService } from '../services/transaction.services/order.service/order.service'

const orderService = new OrderService()

export const registerOrderHandlers = () => {
  /**
   * List orders with filtering and pagination.
   */
  ipcMain.handle(IpcChannel.orderList, async (_event, payload) => {
    try {
      const data = await orderService.list(payload)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  })

  /**
   * Get a single order by ID.
   */
  ipcMain.handle(IpcChannel.orderGet, async (_event, id) => {
    try {
      const data = await orderService.get(id)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  })

  /**
   * Save (create or update) an order.
   */
  ipcMain.handle(IpcChannel.orderSave, async (_event, payload) => {
    try {
      const { id, ...data } = payload
      let result
      if (id) {
        result = await orderService.update(id, data)
      } else {
        result = await orderService.create(data)
      }
      return { success: true, data: result }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  })

  /**
   * Delete an order.
   */
  ipcMain.handle(IpcChannel.orderDelete, async (_event, id) => {
    try {
      await orderService.delete(id)
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  })
}
