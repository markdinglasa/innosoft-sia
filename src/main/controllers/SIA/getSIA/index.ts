import { csvHeaders as headers } from '@shared/data'
import { Error, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { createArrayCsvWriter } from 'csv-writer'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateFileName } from '../../../functions'
import { recordByQuery } from '../../../model'

const csvHeaders = headers.map((header) => header.title)
ipcMain.handle(
  SqlChannel.getSIA,
  async (_event: any, path: string, query: string): Promise<Response> => {
    try {
      const response = await recordByQuery(query)
      if (!response.List) return { IsSomething: false, Message: response.Message }
      const fileName = generateFileName()
      const filePath = paths.join(path, fileName)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      const csvData = response.List.map((item) => [
        item.OrderNumber,
        item.BusinessDay,
        item.CheckOpen,
        item.CheckClose,
        item.TransactionType,
        item.Void,
        item.VoidAmount,
        item.Refund,
        item.RefundAmount,
        item.GuestCount,
        item.GuestCountSenior,
        item.GuestCountPWD,
        item.GrossSalesAmount,
        item.NetSalesAmount,
        item.TotalTax,
        item.OtherLocalTax,
        item.TotalServiceCharge,
        item.TotalTip,
        item.TotalDiscount,
        item.LessTaxAmount,
        item.TotalExemptSales,
        item.RegularOtherDiscountName,
        item.RegularOtherDiscountAmount,
        item.EmployeeDiscountAmount,
        item.SeniorCitizenDiscountAmount,
        item.VIPDiscountAmount,
        item.PWDDiscountAmount,
        item.NationalCoachAthleteMedalofValorDiscountamount,
        item.SMACDiscountAmount,
        item.OnlineDealsDiscountName,
        item.OnlineDealsDiscountAmount,
        item.DiscountField1Name,
        item.DiscountField2Name,
        item.DiscountField3Name,
        item.DiscountField4Name,
        item.DiscountField5Name,
        item.DiscountField6Name,
        item.DiscountField1Amount,
        item.DiscountField2Amount,
        item.DiscountField3Amount,
        item.DiscountField4Amount,
        item.DiscountField5Amount,
        item.DiscountField6Amount,
        item.TotalCashSalesAmount,
        item.TotalGiftCertificateSalesAmount,
        item.TotalEwalletOnlineSalesAmount,
        item.TotalMastercardSalesAmount,
        item.TotalVisaSalesAmount,
        item.TotalDinersSalesAmount,
        item.TotalJCBSalesAmount,
        item.TotalCreditCardSalesAmount,
        item.TerminalNumber,
        item.SMPOSSerialNumber
      ])
      const csvWriter = createArrayCsvWriter({
        path: filePath,
        header: csvHeaders
      })
      await csvWriter.writeRecords(csvData)
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
