import { SIATransactionHeaders as headers } from '@shared/data'
import { Error, Success } from '@shared/messages'
import { Response, SIATransaction, SqlChannel } from '@shared/types'
import { createArrayCsvWriter } from 'csv-writer'
import { ipcMain } from 'electron'
import fs from 'fs'
import paths from 'path'
import { generateSMFileName } from '../../../../../functions'
import { recordByQuery } from '../../../../../model'

const csvHeaders = headers.map((header) => header.title)
ipcMain.handle(
  SqlChannel.getSIATransactions,
  async (_event: any, path: string, query: string, date: string): Promise<Response> => {
    try {
      const response = await recordByQuery(query)
      if (!response.List) return { IsSomething: false, Message: response.Message }

      const fileName = generateSMFileName(false, date)
      const filePath = paths.join(path, fileName)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

      const csvData = response.List.map((item: SIATransaction) => [
        item.OrderNumber,
        item.BusinessDay,
        item.CheckOpen,
        item.CheckClose,
        item.SalesType,
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
        item?.OnlineDealsDiscountAmount,
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
        item?.PaymentType1 ?? 'NA',
        item?.PaymentAmount1 ?? 0,
        item?.PaymentType2 ?? 'NA',
        item?.PaymentAmount2 ?? 0,
        item?.PaymentType3 ?? 'NA',
        item?.PaymentAmount3 ?? 0,
        item?.TotalCashSalesAmount ?? 0,
        item?.TotalGiftCertificateSalesAmount ?? 0,
        item?.TotalDebitCardSalesAmount ?? 0,
        item?.TotalEwalletOnlineSalesAmount ?? 0,
        item?.TotalOtherTenderAmount ?? 0,
        item?.TotalMastercardSalesAmount ?? 0,
        item?.TotalVisaSalesAmount ?? 0,
        item?.TotalAmericanExpressSalesAmount ?? 0,
        item?.TotalDinersSalesAmount ?? 0,
        item?.TotalJCBSalesAmount ?? 0,
        item?.TotalCreditCardSalesAmount ?? 0,
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
      return { IsSomething: false, Message: error.message || Error.e00x02 }
    }
  }
)
