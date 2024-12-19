import { Error } from '@shared/messages'
import {
  ControlNumberQuery,
  GrossSalesQuery,
  mwDailyDiscount,
  mwDailyHourlySales,
  mwDailyHourlySalesRepeated,
  mwDailySales,
  PaymentSalesQuery,
  ServiceChargeQuery,
  TaxAmountQuery
} from '@shared/query'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SqlChannel, Tenant, ToastType } from '@shared/types'
import { windowNotification } from '@shared/utils'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

export const useMWReports = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [BatchNo, setBatchNo] = useState<number>(1)
  const [previousDate, setPreviousDate] = useState<string | null>(null)

  const createReport = useCallback(
    async (path: string, tenant: Tenant, Dates: string) => {
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

        const dailyDiscountQuery: string = mwDailyDiscount({ Terminal, Dates })
        await window.electron.sql.get(
          SqlChannel.getDailyDiscount,
          tenant,
          path,
          BatchNo,
          dailyDiscountQuery
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
          dailyHourlySalesQuery
        )
        // END HOURLY SALES
        // DAILY SALES
        const ControlNoQuery = ControlNumberQuery({ Terminal, Dates })
        const ControlNoResponse = await window.electron.sql.get(
          SqlChannel.getAmount,
          ControlNoQuery
        )
        const ControlNumber = ControlNoResponse?.Data?.ControlNumber ?? 0
        const OldAccumulatedTotal = ControlNoResponse?.Data?.PreviousReading ?? 0
        const VATAmountQuery: string = TaxAmountQuery({ Dates, Terminal })
        const VATAmountResponse = await window.electron.sql.get(
          SqlChannel.getAmount,
          VATAmountQuery
        )
        const GrossSalesQ = GrossSalesQuery({ Dates, Terminal })
        const GrossSalesResponse = await window.electron.sql.get(SqlChannel.getAmount, GrossSalesQ)
        const GrossSalesAmount = Math.round((GrossSalesResponse?.Data?.GrossSales ?? 0) * 100) / 100
        const VatExempt = VATAmountResponse?.Data?.VatExempt ?? 0
        const VATAmount = Math.round((GrossSalesResponse?.Data?.TaxAmount ?? 0) * 100) / 100
        const ServiceChargeQ: string = ServiceChargeQuery({ Dates, Terminal })
        const ServiceChargeResponse = await window.electron.sql.get(
          SqlChannel.getAmount,
          ServiceChargeQ
        )
        const ServiceChargeAmount =
          Math.round((ServiceChargeResponse?.Data?.ServiceCharge ?? 0) * 100) / 100
        const RefundAmount = Math.round((GrossSalesResponse?.Data?.RefundAmount ?? 0) * 100) / 100
        const VoidAmount = Math.round((GrossSalesResponse?.Data?.VoidAmount ?? 0) * 100) / 100
        const NetSalesAmount = Math.round((GrossSalesResponse?.Data?.NetSales ?? 0) * 100) / 100
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
        const SalesType = '01'
        const NetSalesAmountPerSalesType = 0
        const dailySalesQuery: string = mwDailySales({
          Dates,
          Terminal,
          OldAccumulatedTotal,
          NewAccumulatedTotal,
          GrossSalesAmount,
          VatExempt,
          RefundAmount,
          VATAmount,
          ServiceChargeAmount,
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
          dailySalesQuery
        )
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
