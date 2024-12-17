import { Error, Success } from '@shared/messages'
import { DailyHourlySale, MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateMWFilename } from '../../../../../functions'
import { recordByQuery } from '../../../../../model'

ipcMain.handle(
  SqlChannel.getDailyHourlySales,
  async (
    _event: any,
    data: any,
    path: string,
    BatchNo: number,
    dayQuery: string,
    hourlyQuery: string
  ): Promise<Response> => {
    try {
      // Query the database for the sales data
      const dayResponse = (await recordByQuery(dayQuery))?.List ?? []
      const hourlyResponse = (await recordByQuery(hourlyQuery))?.List ?? []

      // Check if the response contains a valid list
      if (!dayResponse || !hourlyResponse) {
        console.error({ IsSomething: false, Message: Error.e00x23 })
      }

      // Generate the filename based on provided parameters
      const fileName = generateMWFilename(
        MWFileType.DailyHourlySales,
        data.TenantCode,
        data.Terminal,
        BatchNo ?? 0 // Default to 0 if BatchNo is not provided
      )
      const filePath = paths.join(path, fileName)

      // If the file already exists, delete it to prevent conflicts
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      // Prepare the sales data in the required format
      //multiple data
      const hourlySalesData =
        hourlyResponse
          ?.map((item: DailyHourlySale) => {
            return [
              `04${item.HourCode}`, // HourCode
              `05${String(item.NetSalesAmountHour)
                .replace(/[^a-zA-Z0-9]/g, '')
                .padEnd(6, '0')}`, // Net Sales Amount for the Hour (formatted)
              `06${item.NoSalesTransactionHour}`, // Number of Sales Transactions for the Hour
              `07${item.CustomerCountHour}` // Customer Count for the Hour
            ].join('\n')
          })
          .join('\n') ?? ''

      const daySalesData =
        dayResponse
          ?.map((item: DailyHourlySale) => {
            return [
              `01${item.MallPartnerCodeId}`, // Mall Partner Code ID
              `02${item.Terminal}`, // Terminal
              `03${String(item.Date).replace(/[^a-zA-Z0-9]/g, '')}`, // Date (formatted)
              hourlySalesData, // Include hourly sales data here
              `08${String(item.NetSalesAmountDay)
                .replace(/[^a-zA-Z0-9]/g, '')
                .padEnd(6, '0')}`, // Net Sales Amount for the Day (formatted)
              `09${item.NoSalesTransactionDay}`, // Number of Sales Transactions for the Day
              `10${item.CustomerCountDay}` // Customer Count for the Day
            ].join('\n')
          })
          .join('\n') ?? ''

      // Write the formatted data to the file
      fs.writeFileSync(filePath, daySalesData, 'utf8')

      // Return success response
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      // Log and return error response
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
