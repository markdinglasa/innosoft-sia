import { Error, Success } from '@shared/messages'
import { mwSalesType } from '@shared/query'
import { DailySale, MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { formatDateMMDDYYYY, generateMWFilename } from '../../../../../functions'
import { recordByQuery } from '../../../../../model'
ipcMain.handle(
  SqlChannel.getDailySales,
  async (
    _event: any,
    data: any,
    path: string,
    BatchNo: number,
    query: string,
    dates: Date,
    oldAccumulatedTotal: number
  ): Promise<Response> => {
    try {
      // Fetch records based on the provided query
      const response = await recordByQuery(query)
      // console.log('daily-sales:', response)
      // Generate the file name and path
      const fileName = generateMWFilename(
        MWFileType.DailySales,
        data.TenantCode,
        data.Terminal,
        BatchNo ?? 0,
        dates
      )
      const filePath = paths.join(path, `${fileName}`)

      // Remove existing file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      const salestypesQ = mwSalesType({ Dates: dates, Terminal: data.Terminal })
      const salestypeR = await recordByQuery(salestypesQ)
      let salestypeD = (salestypeR?.List || []).map(
        (item: { SalesType: string; NetSalesAmount: number }) => {
          return [
            `21${item?.SalesType ?? 'NA'}`,
            `22${
              Number(item?.NetSalesAmount)
                .toFixed(2)
                .toString()
                .replace(/[^a-zA-Z0-9]/g, '') ?? 'NA'
            }`
          ].join('\n')
        }
      )
      // console.log(salestypeR)
      // Format the sales data
      let dailySalesData = (response?.List || [])
        .map((item: DailySale) => {
          return [
            `01${item?.MallPartnerCodeId ?? 'NA'}`,
            `02${item?.Terminal ?? 'NA'}`,
            `03${String(formatDateMMDDYYYY(new Date(item.Date))).replace(/[^a-zA-Z0-9]/g, '') ?? 'NA'}`,
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
            salestypeD.join('\n')
          ].join('\n')
        })
        .join('\n')

      if (!dailySalesData || dailySalesData.length === 0)
        dailySalesData = [
          `01${data.TenantCode ?? 'NA'}`,
          `02${data?.Terminal ?? '00'}`,
          `03${String(formatDateMMDDYYYY(new Date(dates))).replace(/[^a-zA-Z0-9]/g, '') ?? '00000000'}`,
          `04${Number(oldAccumulatedTotal ?? '0')
            .toFixed(2)
            .toString()
            .replace(/[^a-zA-Z0-9]/g, '')}`,
          `05000`,
          `06000`,
          `07000`,
          `08000`,
          `09000`,
          `10000`,
          `11000`,
          `12000`,
          `13000`,
          `14000`,
          `15000`,
          `16000`,
          `17000`,
          `180`,
          `190`,
          `200`,
          `210`,
          `22000`
        ].join('\n')

      // Write the data to the file
      fs.writeFileSync(filePath, dailySalesData, 'utf8')

      // Return a success response
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error writing file:', error)
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
