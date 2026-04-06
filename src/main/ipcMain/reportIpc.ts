import { ipcMain } from 'electron'
import { IpcChannel } from '../../shared/types'
import { ReportService } from '../services/utility.services/sys-report.service'
import { withAuth } from './auth-middleware'

const reportService = new ReportService()

export const registerReportHandlers = () => {
  /**
   * Generates an X-Reading for current shift.
   */
  ipcMain.handle(IpcChannel.reportXReading, withAuth(async (_event, shiftId) => {
    try {
      const data = await reportService.getXReading(shiftId)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }))

  /**
   * Generates a Z-Reading for a terminal and date.
   */
  ipcMain.handle(IpcChannel.reportZReading, withAuth(async (_event, payload) => {
    try {
      const { terminalId, date } = payload
      const data = await reportService.getZReading(terminalId, new Date(date))
      return { success: true, data }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }))
}
