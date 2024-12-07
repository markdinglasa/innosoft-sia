import { Error, Success } from '@shared/messages'
import { DailyHourlySale, MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateMWFilename } from '../../../functions'
import { recordByQuery } from '../../../model'

ipcMain.handle(
  SqlChannel.getDailyHourlySales,
  async (_event: any, data: any, path: string, query: string): Promise<Response> => {
    try {
      // Query the database for the sales data
      const response = await recordByQuery(query)
      console.log('response:', response.List)

      // Check if the response contains a valid list
      if (!response.List) {
        return { IsSomething: false, Message: response.Message }
      }

      // Generate the filename based on provided parameters
      const fileName = generateMWFilename(
        MWFileType.DailyHourlySales,
        data.TenantCode,
        data.Terminal,
        data.BatchNo ?? 0 // Default to 0 if BatchNo is not provided
      )
      const filePath = paths.join(path, fileName)

      // If the file already exists, delete it to prevent conflicts
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      // Prepare the sales data in the required format
      const hourlySalesData = response.List.map((item: DailyHourlySale) => {
        return [
          `01${item.MallPartnerCodeId}`, // Format MallPartnerCodeId
          `02${item.Terminal}`, // Terminal
          `03${item.Date}`, // Date
          `04${item.HourCode}`, // HourCode
          `05${String(item.NetSalesAmountHour).replace(/[^a-zA-Z0-9]/g, '')}`, // Remove special characters from NetSalesAmountHour
          `06${item.NoSalesTransactionHour}`, // No of Sales Transactions for the Hour
          `07${item.CustomerCountHour}`, // Customer Count for the Hour
          `08${String(item.NetSalesAmountDay).replace(/[^a-zA-Z0-9]/g, '')}`, // Remove special characters from NetSalesAmountDay
          `09${item.NoSalesTransactionDay}`, // No of Sales Transactions for the Day
          `10${item.CustomerCountDay}` // Customer Count for the Day
        ].join('\n') // Combine all fields with a newline
      }).join('\n') // Separate each record with a newline

      // Write the formatted data to the file
      fs.writeFileSync(filePath, hourlySalesData, 'utf8')

      // Return success response
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      // Log and return error response
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
