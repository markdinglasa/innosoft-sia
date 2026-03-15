import { Error as ErrorMessage, Success } from '@shared/messages'
import { MWFileType, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { formatDateMMDDYYYY, generateMWFilename } from '../../../../../functions'
import { MegaworldReportService } from '../../../../../services/reports-service/MegaworldReportService'

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
            `22${Number(item?.NetSalesAmount).toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`
          ].join('\r\n')
        }
      )

      let dailySalesData = [
        `01${mainItem.MallPartnerCodeId}`,
        `02${mainItem.Terminal}`,
        `03${String(formatDateMMDDYYYY(new Date(mainItem.Date))).replace(/[^a-zA-Z0-9]/g, '')}`,
        `04${mainItem.OldAccumulatedTotal.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `05${mainItem.NewAccumulatedTotal.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `06${mainItem.GrossSalesAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `07${mainItem.NonTaxSalesAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `08${mainItem.GovMandatedDiscount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `09${mainItem.OtherDiscount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `10${mainItem.RefundAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `11${mainItem.TaxAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `12${mainItem.ServiceChargeAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `13${mainItem.NetSalesAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `14${mainItem.CashSales.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `15${mainItem.CreditDebitsales.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `16${mainItem.OtherPaymentSales.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `17${mainItem.VoidAmount.toFixed(2).replace(/[^a-zA-Z0-9]/g, '')}`,
        `18${mainItem.CustomerCount}`,
        `19${mainItem.ControlNumber}`,
        `20${mainItem.NoSalesTransaction}`,
        salestypeD.join('\r\n')
      ].join('\r\n')

      if (!dailySalesData || dailySalesData.length === 0)
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
