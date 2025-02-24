import { Error } from '@shared/messages'
import {
  GrossSalesQuery,
  mwDailyDiscount,
  mwDailyHourlySales,
  mwDailyHourlySalesRepeated,
  mwDailySales,
  mwDiscounts,
  PaymentSalesQuery,
  PreviousReading,
  ZControlNumber,
  ZVATAnalysis
} from '@shared/query'
import { mwNetSales } from '@shared/query/reports/megaworld/netsales'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SqlChannel, Tenant, ToastType } from '@shared/types'
import { windowNotification } from '@shared/utils'
import { Buffer } from 'buffer'
import html2pdf from 'html2pdf.js'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

export const useMWReports = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [BatchNo, setBatchNo] = useState<number>(1)
  const [previousDate, setPreviousDate] = useState<string | null>(null)

  const createReport = useCallback(
    async (path: string, tenant: Tenant, Dates: string, element: any, IsZReading: boolean) => {
      const { Terminal = 0, TenantCode = '' } = tenant
      const MallPartnerCodeId = String(TenantCode ?? '')
        .slice(0, 8)
        .replace(/[^a-zA-Z0-9]/g, '')
        .padEnd(8, '0')
      try {
        const currentDate = new Date(Dates).toDateString()
        if (currentDate === previousDate) setBatchNo(0)
        else {
          setBatchNo((prev) => prev + 1)
          setPreviousDate(currentDate)
        }

        const ControlNoQuery = ZControlNumber({ Terminal, Dates })
        const ControlNoResponse = await window.electron.sql.get(
          SqlChannel.getAmount,
          ControlNoQuery
        )
        const ControlNumber = ControlNoResponse?.Data?.ControlNumber ?? 0
        const PreviousReadingQuery = PreviousReading({ Dates, Terminal })
        const PreviousReadingResponse = await window.electron.sql.get(
          SqlChannel.getAmount,
          PreviousReadingQuery
        )
        const OldAccumulatedTotal =
          Math.round((PreviousReadingResponse?.Data?.PreviousReading ?? 0) * 100) / 100
        const dailyDiscountQuery: string = mwDailyDiscount({ Terminal, Dates })

        await window.electron.sql.get(
          SqlChannel.getDailyDiscount,
          tenant,
          path,
          BatchNo,
          dailyDiscountQuery,
          Dates
        )

        const dailyDaySalesQuery: string = mwDailyHourlySales({
          Dates,
          Terminal,
          MallPartnerCodeId
        })
        // END DAILY DISCOUNTS
        // HOURLY SALES
        const dailyHourlySalesQuery: string = mwDailyHourlySalesRepeated({
          Dates,
          Terminal
        })
        await window.electron.sql.get(
          SqlChannel.getDailyHourlySales,
          tenant,
          path,
          BatchNo,
          dailyDaySalesQuery,
          dailyHourlySalesQuery,
          Dates
        )
        // END HOURLY SALES
        // DAILY SALES

        //const OldAccumulatedTotal = ControlNoResponse?.Data?.PreviousReading ?? 0
        /*const VATAmountQuery: string = TaxAmountQuery({ Dates, Terminal })
        const VATAmountResponse = await window.electron.sql.get(
          SqlChannel.getAmount,
          VATAmountQuery
        )*/
        const GrossSalesQ = GrossSalesQuery({ Dates, Terminal })
        const GrossSalesResponse = await window.electron.sql.get(SqlChannel.getAmount, GrossSalesQ)
        //const GrossSalesAmount = Math.round((GrossSalesResponse?.Data?.GrossSales ?? 0) * 100) / 100
        const vaQuery = ZVATAnalysis({ Dates, Terminal })
        const vaResponse = await window.electron.sql.get(SqlChannel.getAmount, vaQuery)
        const NonVATSalesAmount = Math.round((vaResponse?.Data?.NONVat ?? 0) * 100) / 100
        const VATAmount = Math.round((vaResponse?.Data?.VATAmount ?? 0) * 100) / 100
        const RefundAmount = Math.round((GrossSalesResponse?.Data?.RefundAmount ?? 0) * 100) / 100
        const VoidAmount = Math.round((GrossSalesResponse?.Data?.VoidAmount ?? 0) * 100) / 100
        const netsalesQuery = mwNetSales({ Dates, Terminal })
        const netsalesResponse = await window.electron.sql.get(SqlChannel.getAmount, netsalesQuery)
        const NetSalesAmount = Math.round((netsalesResponse?.Data?.NetSales ?? 0) * 100) / 100
        const NewAccumulatedTotal: number =
          Math.round((NetSalesAmount + OldAccumulatedTotal) * 100) / 100
        const PaymentSalesQ = PaymentSalesQuery({ Dates, Terminal })
        const PaymentSalesReponse = await window.electron.sql.get(
          SqlChannel.getAmount,
          PaymentSalesQ
        )
        const CashSales = Math.round((PaymentSalesReponse?.Data?.CashSales ?? 0) * 100) / 100
        const CreditDebitsales =
          Math.round((PaymentSalesReponse?.Data?.CreditDebitsales ?? 0) * 100) / 100
        const OtherPaymentSales =
          Math.round((PaymentSalesReponse?.Data?.OtherPaymentSales ?? 0) * 100) / 100
        const discQuery = mwDiscounts({ Dates, Terminal })
        const discResponse = await window.electron.sql.get(SqlChannel.getAmount, discQuery)

        const GovMandatedDiscount =
          Math.round((discResponse?.Data?.GovMandatedDiscount ?? 0) * 100) / 100
        const OtherDiscount = Math.round((discResponse?.Data?.OtherDiscount ?? 0) * 100) / 100
        const tmpGrossSaless = NetSalesAmount + GovMandatedDiscount + OtherDiscount
        const GrossSales = Math.round(tmpGrossSaless * 100) / 100
        const SalesType = '01'
        const NetSalesAmountPerSalesType = 0
        const dailySalesQuery: string = mwDailySales({
          Dates,
          Terminal,
          OldAccumulatedTotal,
          NewAccumulatedTotal,
          GrossSalesAmount: GrossSales,
          VatExempt: NonVATSalesAmount,
          RefundAmount,
          VATAmount,
          ServiceChargeAmount: NonVATSalesAmount,
          NetSalesAmount,
          CashSales,
          CreditDebitsales,
          OtherPaymentSales,
          VoidAmount,
          ControlNumber,
          SalesType,
          NetSalesAmountPerSalesType,
          MallPartnerCodeId
        })
        await window.electron.sql.get(
          SqlChannel.getDailySales,
          tenant,
          path,
          BatchNo,
          dailySalesQuery,
          Dates,
          OldAccumulatedTotal
        )
        if (IsZReading && element) {
          const options = {
            margin: 0.1,
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
          }
          const pdfBlob = await html2pdf().from(element).set(options).outputPdf('blob')
          const arrayBuffer = await pdfBlob.arrayBuffer()
          await window.electron.sql.post(SqlChannel.getZReading, tenant, Dates, BatchNo, {
            buffer: Buffer.from(arrayBuffer),
            targetDir: path
          })
        }

        // Success notification
        windowNotification('Megaworld Reports', 'New reports have been created.', path)
      } catch (error: any) {
        console.error('Report creation failed:', error)

        // Failure notification
        windowNotification('Megaworld Reports Failed', error.message || 'An unknown error occurred')

        // Display Snackbar error
        dispatch(
          setSnackbar({
            display: true,
            message: Error.e00x01,
            type: ToastType.error
          })
        )
      }
    },
    [dispatch]
  )

  return createReport
}
