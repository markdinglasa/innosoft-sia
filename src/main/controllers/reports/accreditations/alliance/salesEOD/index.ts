import { Error } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { addDays, format, parseISO } from 'date-fns'
import { ipcMain } from 'electron'
import { AllianceReportService } from '../../../../../services/reports/AllianceReportService'

interface Data {
  Terminal: number
  TenantCode: string
  POSKey: string
}

function getDatesInRange(dateStart: string, dateEnd: string): string[] {
  const dates: string[] = []
  let current = parseISO(dateStart)
  const end = parseISO(dateEnd)
  while (current <= end) {
    dates.push(format(current, 'yyyy-MM-dd'))
    current = addDays(current, 1)
  }
  return dates
}

ipcMain.handle(
  SqlChannel.getAllianceSalesEOD,
  async (
    _event: unknown,
    data: Data,
    path: string,
    dates: string | { DateStart: string; DateEnd: string },
    category: string
  ): Promise<Response> => {
    try {
      if (typeof dates === 'string') {
        return await AllianceReportService.generateSalesEOD(path, dates, category, data)
      } else {
        const { DateStart, DateEnd } = dates
        const dateArray = getDatesInRange(DateStart, DateEnd)
        let successCount = 0
        for (const date of dateArray) {
          const controlNumber = await AllianceReportService.getControlNumber(data.Terminal, date)
          if (controlNumber > 0) {
            const res = await AllianceReportService.generateSalesEOD(path, date, category, data)
            if (res.IsSomething) {
              successCount++
            }
          }
        }
        return { IsSomething: successCount > 0, Message: `Generated ${successCount} reports.` }
      }
    } catch (error: unknown) {
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
