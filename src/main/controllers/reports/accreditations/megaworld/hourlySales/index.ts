import { Error as ErrorMessage, Success } from '@shared/messages'
import { DailyHourlySale, MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'node:fs'
import paths from 'node:path'
import { formatDateMMDDYYYY, generateMWFilename } from '../../../../../functions'
import { MegaworldReportService } from '../../../../../services/reports/MegaworldReportService'

ipcMain.handle(
  SqlChannel.getDailyHourlySales,
  async (
    _event: any,
    data: any,
    path: string,
    BatchNo: number,
    dates: Date | string
  ): Promise<Response> => {
    try {
      const activeDate = new Date(dates)
      const { day: dayResponse, hourly: hourlyResponse } =
        await MegaworldReportService.getHourlySalesData(data.Terminal, data.TenantCode, activeDate)

      // Generate the filename based on provided parameters
      const fileName = generateMWFilename(
        MWFileType.DailyHourlySales,
        data.TenantCode,
        data.Terminal,
        BatchNo ?? 0,
        activeDate
      )
      const filePath = paths.join(path, fileName)

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

      const hourlySalesData =
        hourlyResponse
          ?.map((item: DailyHourlySale) => {
            return [
              `04${item.HourCode}`, // HourCode
              `05${Number(item.NetSalesAmountHour)
                .toFixed(2)
                .toString()
                .replace(/[^a-zA-Z0-9]/g, '')}`, // Net Sales Amount for the Hour (formatted)
              `06${item.NoSalesTransactionHour}`, // Number of Sales Transactions for the Hour
              `07${item.CustomerCountHour}` // Customer Count for the Hour
            ].join('\r\n')
          })
          .join('\r\n') ?? ''

      let daySalesData =
        dayResponse
          ?.map((item: DailyHourlySale) => {
            return [
              `01${item.MallPartnerCodeId}`, // Mall Partner Code ID
              `02${item.Terminal}`, // Terminal
              `03${String(formatDateMMDDYYYY(new Date(item.Date))).replace(/[^a-zA-Z0-9]/g, '')}`, // Date (formatted)
              hourlySalesData, // Include hourly sales data here
              `08${Number(item.NetSalesAmountDay)
                .toFixed(2)
                .toString()
                .replace(/[^a-zA-Z0-9]/g, '')}`, // Net Sales Amount for the Day (formatted)
              `09${item.NoSalesTransactionDay}`, // Number of Sales Transactions for the Day
              `10${item.CustomerCountDay}` // Customer Count for the Day
            ].join('\n')
          })
          .join('\n') ?? ''
      if (!daySalesData || daySalesData.length === 0)
        daySalesData = [
          `01${data.TenantCode ?? 'NA'}`,
          `02${data?.Terminal ?? '00'}`,
          `03${String(formatDateMMDDYYYY(new Date(dates))).replace(/[^a-zA-Z0-9]/g, '') ?? '00000000'}`,
          `040`,
          `05000`,
          `060`,
          `070`,
          `08000`,
          `090`,
          `100`
        ].join('\r\n')

      fs.writeFileSync(filePath, daySalesData, 'utf8')
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error writing file:', error.message || error)
      return { IsSomething: false, Message: ErrorMessage.e00x02 }
    }
  }
)
