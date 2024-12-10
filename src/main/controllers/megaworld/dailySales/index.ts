import { Error, Success } from '@shared/messages'
import { DailySale, MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateMWFilename } from '../../../functions'
import { recordByQuery } from '../../../model'
ipcMain.handle(
  SqlChannel.getDailySales,
  async (
    _event: any,
    data: any,
    path: string,
    BatchNo: number,
    query: string
  ): Promise<Response> => {
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
        BatchNo ?? 0
      )
      const filePath = paths.join(path, `${fileName}`)

      // Remove existing file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      // Format the sales data
      const hourlySalesData = response.List.map((item: DailySale) => {
        return [
          `01${item?.MallParterCodeId ?? 'NA'}`,
          `02${item?.Terminal ?? 'NA'}`,
          `03${item?.Date ?? 'NA'}`,
          `04${item?.OldAccumulatedTotal ?? 'NA'}`,
          `05${item?.NewAccumulatedTotal ?? 'NA'}`,
          `06${item?.GrossSalesAmount ?? 'NA'}`,
          `07${item?.NonTaxSalesAmount ?? 'NA'}`,
          `08${item?.GovMandatedDiscount}`,
          `09${item?.OtherDiscount ?? 'NA'}`,
          `10${item?.RefundAmount ?? 'NA'}`,
          `11${item?.TaxAmount ?? 'NA'}`,
          `12${item?.ServiceChargeAmount ?? 'NA'}`,
          `13${item?.NetSalesAmount ?? 'NA'}`,
          `14${item?.CashSales ?? 'NA'}`,
          `15${item?.CreditDebitsales ?? 'NA'}`,
          `16${item?.OtherPaymentSales ?? 'NA'}`,
          `17${item?.VoidAmount ?? 'NA'}`,
          `18${item?.CustomerCount ?? 'NA'}`,
          `19${item?.ControlNumber ?? 'NA'}`,
          `20${item?.NoSalesTransaction ?? 'NA'}`,
          `21${item?.SalesType ?? 'NA'}`,
          `22${item?.NetSalesAmountPerSalesType ?? 'NA'}`
        ].join('\n')
      }).join('\n')

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
