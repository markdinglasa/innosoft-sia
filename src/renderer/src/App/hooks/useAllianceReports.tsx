import { Error } from '@shared/messages'
import {
  AllianceSalesEODQuery,
  AllianceTenderTotalQuery,
  ControlNumberQuery,
  PreviousAmountsQuery,
  ServiceChargeQuery
} from '@shared/query'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SqlChannel, Tenant, ToastType } from '@shared/types'
import { windowNotification } from '@shared/utils'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const useAllianceReports = () => {
  const dispatch = useDispatch<AppDispatch>()

  const createReport = useCallback(
    async (path: string, tenant: Tenant, Dates: string, Category: string) => {
      const { Terminal = 0 } = tenant
      try {
        const TenderQ = AllianceTenderTotalQuery({ Terminal, Dates })
        const TenderResponse = await window.electron.sql.get(SqlChannel.getAmount, TenderQ)
        const ServiceChargeQ: string = ServiceChargeQuery({ Dates, Terminal })
        const ServiceChargeResponse = await window.electron.sql.get(
          SqlChannel.getAmount,
          ServiceChargeQ
        )
        const ControlNoQuery = ControlNumberQuery({ Terminal, Dates })
        const ControlNoResponse = await window.electron.sql.get(
          SqlChannel.getAmount,
          ControlNoQuery
        )
        const CashSales = TenderResponse?.Data?.CashSales ?? 0
        const CashSalesCount = TenderResponse?.Data?.CashSalesCount ?? 0
        const CreditSales = TenderResponse?.Data?.CreditSales ?? 0
        const CreditSalesCount = TenderResponse?.Data?.CreditSalesCount ?? 0
        const ChargeSales = TenderResponse?.Data?.ChargeSales ?? 0
        const ChargeSalesCount = TenderResponse?.Data?.ChargeSalesCount ?? 0
        const GiftCertificateSales = TenderResponse?.Data?.GiftCertificateSales ?? 0
        const GiftCertificateSalesCount = TenderResponse?.Data?.GiftCertificateSalesCount ?? 0
        const OtherTenderSales = TenderResponse?.Data?.OtherTenderSales ?? 0
        const OtherTenderSalesCount = TenderResponse?.Data?.OtherTenderSalesCount ?? 0
        const EWT = 0
        const ZeroRated = 0
        const ServiceCharge = ServiceChargeResponse?.Data?.ServiceCharge ?? 0
        const ServiceChargeCount = ServiceChargeResponse?.Data?.ServiceChargeCount ?? 0
        const ControlNumber = ControlNoResponse?.Data?.ControlNumber ?? 0
        const PreviousAmountsQ = PreviousAmountsQuery({ Terminal, Dates })
        const PreviousAmountR = await window.electron.sql.get(
          SqlChannel.getAmount,
          PreviousAmountsQ
        )
        const PreviousTax = PreviousAmountR?.Data?.previoustax ?? 0
        const PreviousReading = PreviousAmountR?.Data?.PreviousReading ?? 0
        const PreviousTaxSales = PreviousAmountR?.Data?.previoustaxsale ?? 0
        const PreviousNonTaxSales = PreviousAmountR?.Data?.previousnotaxsale ?? 0
        const salesQ = AllianceSalesEODQuery({
          Terminal,
          Dates,
          PreviousReading,
          PreviousTax,
          PreviousTaxSales,
          PreviousNonTaxSales,
          ControlNumber,
          ServiceCharge,
          ServiceChargeCount,
          CashSales,
          CashSalesCount,
          CreditSales,
          CreditSalesCount,
          ChargeSales,
          ChargeSalesCount,
          GiftCertificateSales,
          GiftCertificateSalesCount,
          OtherTenderSales,
          OtherTenderSalesCount,
          EWT,
          ZeroRated
        })
        await window.electron.sql.get(
          SqlChannel.getAllianceSalesEOD,
          tenant,
          `${path}`,
          salesQ,
          Dates,
          Category
        )
        // Success notification
        windowNotification('Alliance Reports', 'New reports have been created.', path)
      } catch (error: any) {
        console.error('Report creation failed:', error)

        // Failure notification
        windowNotification('Alliance Reports Failed', error.message || 'An unknown error occurred')

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
