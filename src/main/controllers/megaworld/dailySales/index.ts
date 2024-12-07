import { Error, Success } from '@shared/messages'
import { DailySale, MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateMWFilename } from '../../../functions'
import { recordByQuery } from '../../../model'
ipcMain.handle(
  SqlChannel.getDailySales,
  async (_event: any, data: any, path: string, query: string): Promise<Response> => {
    try {
      // Fetch records based on the provided query
      const response = await recordByQuery(query)

      // Handle case when response does not have a 'List'
      if (!response.List) {
        return { IsSomething: false, Message: response.Message }
      }

      // Generate the file name and path
      const fileName = generateMWFilename(
        MWFileType.DailySales,
        data.TenantCode,
        data.Terminal,
        data.BatchNo ?? 0
      )
      const filePath = paths.join(path, `${fileName}`)

      // Remove existing file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      // Format the sales data
      const hourlySalesData = response.List.map((item: DailySale) => {
        return [
          `01${item.MallParterCodeId}`,
          `02${item.Terminal}`,
          `03${item.Date}`,
          `04${item.OldAccumulatedTotal}`,
          `05${item.NewAccumulatedTotal}`,
          `06${item.GrossSalesAmount}`,
          `07${item.NonTaxSalesAmount}`,
          `08${item.GovMandatedDiscount}`,
          `09${item.OtherDiscount}`,
          `10${item.RefundAmount}`,
          `11${item.TaxAmount}`,
          `12${item.ServiceChargeAmount}`,
          `13${item.NetSalesAmount}`,
          `14${item.CashSales}`,
          `15${item.CreditDebitsales}`,
          `16${item.OtherPaymentSales}`,
          `17${item.VoidAmount}`,
          `18${item.CustomerCount}`,
          `19${item.ControlNumber}`,
          `20${item.NoSalesTransaction}`,
          `21${item.SalesType}`,
          `22${item.NetSalesAmountPerSalesType}`
        ].join('\n') // Join each field with a newline
      }).join('\n') // Join each record with a newline

      // Write the data to the file
      fs.writeFileSync(filePath, hourlySalesData, 'utf8')

      // Return a success response
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
