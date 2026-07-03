import { Error } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { AllianceReportService } from '../../../../../services/reports/AllianceReportService'

interface Data {
  Terminal: number
  TenantCode: string
  POSKey: string
}

ipcMain.handle(
  SqlChannel.getAllianceSalesEOD,
  async (
    _event: unknown,
    data: Data,
    path: string,
    dates: string,
    category: string
  ): Promise<Response> => {
    try {
      return await AllianceReportService.generateSalesEOD(path, dates, category, data)
    } catch (error: unknown) {
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
