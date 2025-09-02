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

      const csvData: any = response.List.map((item: SIATransaction) => {
        return Object.values(item).map((val: string | number) =>
          typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== ''
            ? parseFloat(val ?? 0)
            : val
        )
      })
      console.log('csv-data:', csvData)

      const csvWriter = createArrayCsvWriter({
        path: filePath,
        header: csvHeaders,
        alwaysQuote: true,
        fieldDelimiter: `,`,
        recordDelimiter: '\n'
      })

      await csvWriter.writeRecords(csvData)
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      return { IsSomething: false, Message: error.message || Error.e00x02 }
    }
  }
)
/*item?.OrderNumber,
          item?.BusinessDay,
          item?.CheckOpen,
          item?.CheckClose,
          item?.SalesType,
          item?.TransactionType,
          item?.Void,
          parseFloat(item?.VoidAmount),
          item?.Refund,
          parseFloat(item?.RefundAmount),
          item?.GuestCount,
          item?.GuestCountSenior,
          item?.GuestCountPWD,
          parseFloat(item?.GrossSalesAmount),
          parseFloat(item?.NetSalesAmount),
          parseFloat(item?.TotalTax),
          parseFloat(item?.OtherLocalTax),
          parseFloat(item?.TotalServiceCharge),
          item?.TotalTip,
          parseFloat(item?.TotalDiscount),
          parseFloat(item?.LessTaxAmount),
          parseFloat(item?.TaxExemptSales),
          item?.RegularOtherDiscountName,
          parseFloat(item?.RegularOtherDiscountAmount),
          parseFloat(item?.EmployeeDiscountAmount),
          parseFloat(item?.SeniorCitizenDiscountAmount),
          parseFloat(item?.VIPDiscountAmount),
          parseFloat(item?.PWDDiscountAmount),
          parseFloat(item?.NationalCoachAthleteMedalofValorDiscountamount),
          parseFloat(item?.SMACDiscountAmount),
          item?.OnlineDealsDiscountName,
          parseFloat(item?.OnlineDealsDiscountAmount),
          item?.DiscountField1Name,
          item?.DiscountField2Name,
          item?.DiscountField3Name,
          item?.DiscountField4Name,
          item?.DiscountField5Name,
          item?.DiscountField6Name,
          parseFloat(item?.DiscountField1Amount),
          parseFloat(item?.DiscountField2Amount),
          parseFloat(item?.DiscountField3Amount),
          parseFloat(item?.DiscountField4Amount),
          parseFloat(item?.DiscountField5Amount),
          parseFloat(item?.DiscountField6Amount),
          item?.PaymentType1,
          parseFloat(item?.PaymentAmount1),
          item?.PaymentType2,
          parseFloat(item?.PaymentAmount2),
          item?.PaymentType3,
          parseFloat(item?.PaymentAmount3),
          parseFloat(item?.TotalCashSalesAmount),
          parseFloat(item?.TotalGiftCertificateSalesAmount),
          parseFloat(item?.TotalDebitCardSalesAmount),
          parseFloat(item?.TotalEwalletOnlineSalesAmount),
          parseFloat(item?.TotalOtherTenderAmount),
          parseFloat(item?.TotalMastercardSalesAmount),
          parseFloat(item?.TotalVisaSalesAmount),
          parseFloat(item?.TotalAmericanExpressSalesAmount),
          parseFloat(item?.TotalDinersSalesAmount),
          parseFloat(item?.TotalJCBSalesAmount),
          parseFloat(item?.TotalCreditCardSalesAmount),
          item?.TerminalNumber,
          item?.SMPOSSerialNumber*/
