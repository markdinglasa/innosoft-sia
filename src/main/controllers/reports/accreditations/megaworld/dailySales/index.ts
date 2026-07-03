import { Error as ErrorMessage, Success } from '@shared/messages'
import { MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'node:fs'
import paths from 'node:path'
import { formatDateMMDDYYYY, generateMWFilename } from '../../../../../functions'
import { MegaworldReportService } from '../../../../../services/reports/MegaworldReportService'

ipcMain.handle(
  SqlChannel.getDailySales,
  async (
    _event: any,
    data: any,
    path: string,
    BatchNo: number,
    dates: Date | string
  ): Promise<Response> => {
    try {
      const activeDate = new Date(dates)
      const terminalId = data.Terminal
      const tenantCode = data.TenantCode

      // Fetch data using Service
      const mainItem = await MegaworldReportService.getDailySalesData(
        terminalId,
        tenantCode,
        activeDate
      )
      const salestypeResult = await MegaworldReportService.getSalesTypeData(terminalId, activeDate)

      const fileName = generateMWFilename(
        MWFileType.DailySales,
        data.TenantCode,
        data.Terminal,
        BatchNo ?? 0,
        activeDate
      )
      const filePath = paths.join(path, `${fileName}`)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

      const salestypeD = (salestypeResult || []).map(
        (item: { SalesType: string; NetSalesAmount: number }) => {
          return [
            `21${item?.SalesType ?? 'NA'}`,
            `22${
              Number(item?.NetSalesAmount)
                .toFixed(2)
                .toString()
                .replace(/[^a-zA-Z0-9]/g, '') ?? 'NA'
            }`
          ].join('\r\n')
        }
      )
      // console.log(salestypeR)
      // Format the sales data
      // console.log(response?.List)
      let dailySalesData: string = [
        `01${mainItem?.MallPartnerCodeId ?? 'NA'}`,
        `02${mainItem?.Terminal ?? 'NA'}`,
        `03${String(formatDateMMDDYYYY(new Date(mainItem.Date))).replace(/[^a-zA-Z0-9]/g, '') ?? 'NA'}`,
        `04${Number(mainItem?.OldAccumulatedTotal ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `05${Number(mainItem?.NewAccumulatedTotal ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `06${Number(mainItem?.GrossSalesAmount ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `07${Number(mainItem?.NonTaxSalesAmount ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `08${Number(mainItem?.GovMandatedDiscount)
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `09${Number(mainItem?.OtherDiscount ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `10${Number(mainItem?.RefundAmount ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `11${Number(mainItem?.TaxAmount ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `12${Number(mainItem?.ServiceChargeAmount ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `13${Number(mainItem?.NetSalesAmount ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `14${Number(mainItem?.CashSales ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `15${Number(mainItem?.CreditDebitsales ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `16${Number(mainItem?.OtherPaymentSales ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `17${Number(mainItem?.VoidAmount ?? 'NA')
          .toFixed(2)
          .toString()
          .replace(/[^a-zA-Z0-9]/g, '')}`,
        `18${mainItem?.CustomerCount ?? 'NA'}`,
        `19${mainItem?.ControlNumber ?? 'NA'}`,
        `20${mainItem?.NoSalesTransaction ?? 'NA'}`,
        salestypeD.join('\n')
      ].join('\n')

      if (!dailySalesData)
        dailySalesData = [
          `01${data.TenantCode ?? 'NA'}`,
          `02${data?.Terminal ?? '00'}`,
          `03${String(formatDateMMDDYYYY(new Date(dates))).replace(/[^a-zA-Z0-9]/g, '') ?? '00000000'}`,
          `04${(0).toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
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
        ].join('\r\n')

      fs.writeFileSync(filePath, dailySalesData, 'utf8')
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      console.error('Error writing file:', error.message || error)
      return { IsSomething: false, Message: ErrorMessage.e00x02 }
    }
  }
)
