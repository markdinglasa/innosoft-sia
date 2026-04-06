import { ipcMain } from 'electron'
import { IpcChannel } from '@shared/types'
import { ShiftService } from '../services/transaction.services/shift.service'
import { withAuth } from './auth-middleware'

const shiftService = new ShiftService()

/**
 * Registers IPC handlers for Shift Management (FEAT-TRX-011).
 */
export function registerShiftHandlers() {
  
  // 1. Open Shift
  ipcMain.handle(IpcChannel.shiftOpen, withAuth(async (_event, { userId, terminalId, startingCash }) => {
    try {
      return await shiftService.openShift(userId, terminalId, startingCash)
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to open shift' }
    }
  }))

  // 2. Close Shift
  ipcMain.handle(IpcChannel.shiftClose, withAuth(async (_event, { shiftId, endingCash, remarks }) => {
    try {
      return await shiftService.closeShift(shiftId, endingCash, remarks)
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to close shift' }
    }
  }))

  // 3. Get Current Shift Status
  ipcMain.handle(IpcChannel.shiftStatus, withAuth(async (_event, { userId, terminalId }) => {
    try {
      const data = await shiftService.getCurrentShift(userId, terminalId)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to get shift status' }
    }
  }))
}
