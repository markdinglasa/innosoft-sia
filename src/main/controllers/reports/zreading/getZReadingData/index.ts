import { Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { ZReadingReportService } from '../../../../services/reports/ZReadingReportService'

ipcMain.handle(
  SqlChannel.getZReadingData,
  async (_event: any, terminalId: number, dates: Date | string): Promise<Response> => {
    try {
      const activeDate = new Date(dates)
      const data = await ZReadingReportService.getZReadingData(terminalId, activeDate)
      return { IsSomething: true, Message: Success.s00x00, Data: data }
    } catch (error: any) {
      console.error('getZReadingData Error:', error.message || error)
      return { IsSomething: false, Message: 'Failed to fetch Z-Reading data' }
    }
  }
)
