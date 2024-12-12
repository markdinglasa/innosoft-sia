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
          `01${item?.MallPartnerCodeId ?? 'NA'}`,
          `02${item?.Terminal ?? 'NA'}`,
          `03${String(item.Date).replace(/[^a-zA-Z0-9]/g, '') ?? 'NA'}`,
          `04${Number(item?.OldAccumulatedTotal ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `05${Number(item?.NewAccumulatedTotal ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `06${Number(item?.GrossSalesAmount ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `07${Number(item?.NonTaxSalesAmount ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `08${Number(item?.GovMandatedDiscount)
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `09${Number(item?.OtherDiscount ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `10${Number(item?.RefundAmount ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `11${Number(item?.TaxAmount ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `12${Number(item?.ServiceChargeAmount ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `13${Number(item?.NetSalesAmount ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `14${Number(item?.CashSales ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `15${Number(item?.CreditDebitsales ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `16${Number(item?.OtherPaymentSales ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `17${Number(item?.VoidAmount ?? 'NA')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `18${item?.CustomerCount ?? 'NA'}`,
          `19${item?.ControlNumber ?? 'NA'}`,
          `20${item?.NoSalesTransaction ?? 'NA'}`,
          `21${item?.SalesType ?? 'NA'}`,
          `22${
            Number(item?.NetSalesAmountPerSalesType)
              .toFixed(2)
              .toString()
              .replace(/[^a-zA-Z0-9]/g, '') ?? 'NA'
          }`
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
