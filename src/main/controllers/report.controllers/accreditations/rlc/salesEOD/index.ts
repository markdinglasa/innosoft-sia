import { Error, Success } from '@shared/messages'
import { Response, RLCSalesEOD, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { formatDateSlash, generateRLCFilename } from '../../../../../functions'
import { recordByQuery } from '../../../../../model'

ipcMain.handle(
  SqlChannel.getRLCSalesEOD,
  async (
    _event: any,
    data: any,
    path: string,
    BatchNo: number,
    query: string,
    date: Date
  ): Promise<Response> => {
    try {
      // Fetch records based on the provided query
      const response = await recordByQuery(query)

      // Handle case when response does not have a 'List'
      if (!response.List) return { IsSomething: false, Message: response.Message }

      // Generate the file name and path
      const fileName = generateRLCFilename(data.TenantCode, data.Terminal, BatchNo ?? 0, date)
      const filePath = paths.join(path, `${fileName}`)

      // Remove existing file if it exists
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

      // Format the sales data
      const salesEOD = response.List.map((item: RLCSalesEOD) => {
        return [
          `01${String(item?.TenantId ?? '0').padStart(16, '0')}`,
          `02${String(item?.Terminal ?? '0').padStart(16, '0')}`,
          `03${Number(item?.GrossSales ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `04${Number(item?.VATAmount ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `05${Number(item?.VoidAmount ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `06${Number(item?.VoidCount ?? '0')
            .toString()
            .padStart(16, '0')}`,
          `07${Number(item?.DiscountAmount ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `08${Number(item?.DiscountCount ?? '0')
            .toString()
            .padStart(16, '0')}`,
          `09${Number(item?.RefundAmount ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `10${Number(item?.RefundCount ?? '0')
            .toString()
            .padStart(16, '0')}`,
          `11${Number(item?.Adjustments ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `12${Number(item?.AdjustmentsCount ?? '0')
            .toString()
            .padStart(16, '0')}`,
          `13${Number(item?.ServiceCharge ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `14${Number(item?.PreviousEOD ?? '0')
            .toString()
            .padStart(16, '0')}`,
          `15${Number(item?.PreviousReading ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `16${Number(item?.CurrentEOD ?? '0')
            .toString()
            .padStart(16, '0')}`,
          `17${Number(item?.CurrentReading ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `18${formatDateSlash(new Date(item?.TransactionDate ?? ''))
            .toString()
            .padStart(16, '0')}`,
          `19${Number(item?.Novelty ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `20${Number(item?.Misc ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `21${Number(item?.LocalTax ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `22${Number(item?.CreditSales ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `23${Number(item?.CreditTax ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `24${Number(item?.NonVATSales ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `25${Number(item?.PharmaSales ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `26${Number(item?.DisabilityDiscount ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `27${Number(item?.GrossSalesFixed ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `28${Number(item?.ReprintedAmount ?? '0')
            .toFixed(2)
            .toString()
            .padStart(16, '0')}`,
          `29${Number(item?.ReprintedCount ?? '0')
            .toString()
            .padStart(16, '0')}`
        ].join('\n')
      }).join('\n')

      // Write the data to the file
      fs.writeFileSync(filePath, salesEOD, 'utf8')

      // Return a success response
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
