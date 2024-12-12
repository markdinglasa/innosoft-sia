import { mdiInformation, mdiPause, mdiPlay, mdiRestart } from '@mdi/js'
import { Error } from '@shared/messages'
import {
  ControlNumberQuery,
  GrossSalesQuery,
  PaymentSalesQuery,
  SIATransactionDetailQuery,
  SIATransactions,
  ServiceChargeQuery,
  TaxAmountQuery,
  mwDailyDiscount,
  mwDailyHourlySales,
  mwDailyHourlySalesRepeated,
  mwDailySales
} from '@shared/query'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, ButtonColor, SFC, SqlChannel, ToastType } from '@shared/types'
import { formatDates } from '@shared/utils'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getActiveTenant,
  getBatchNo,
  getInitialize,
  getIsConnected,
  getPath,
  getTenant
} from '../../selectors'
import { setInitialize } from '../../store/manager'
import { Tenants } from '../../types'
import { LoadingScreen } from '../LoadingScreen'
import * as S from './Styles'

export const Initialize: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState<boolean>(false)
  const path = useSelector(getPath)
  const isConnected = useSelector(getIsConnected)
  const tenant = useSelector(getTenant)
  const initialized = useSelector(getInitialize)
  const activeTenant = useSelector(getActiveTenant)
  const batchNo = useSelector(getBatchNo)

  const checkFields = async (): Promise<boolean> => {
    try {
      if (!path) return false
      const response: any = await window.electron.sql.get(SqlChannel.checkFields, path)
      if (!response.IsSomething) return false
      return true
    } catch (error: any) {
      return false
    }
  }

  const renderLoadingScreen = () => {
    if (loading) return <LoadingScreen />
    return null
  }

  const handleInitialize = async () => {
    if (!isConnected) {
      dispatch(setSnackbar({ display: true, message: Error.e00x14, type: ToastType.error }))
    }
    const fieldsValid = await checkFields()
    if (!fieldsValid) {
      dispatch(setSnackbar({ display: true, message: Error.e00x44, type: ToastType.error }))
    }
    if (!activeTenant) {
      dispatch(setSnackbar({ display: true, message: Error.e00x46, type: ToastType.error }))
    }
    if (!tenant) {
      dispatch(setSnackbar({ display: true, message: Error.e00x46, type: ToastType.error }))
    }
    if (tenant && fieldsValid && isConnected && activeTenant) {
      dispatch(setInitialize(true))
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 9000)
    }
  }

  const handleRestart = () => {
    dispatch(setInitialize(true))
    loadData()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 9000)
  }

  const handlePause = () => {
    if (initialized) {
      dispatch(setInitialize(false))
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 9000)
    } else {
      dispatch(setSnackbar({ display: true, message: Error.e00x01, type: ToastType.error }))
    }
  }

  const Terminal: number = useMemo(() => parseInt(tenant.Terminal, 10), [tenant]) //TerminalId
  const SMPOSSerialNumber = tenant.POSSerialNumber

  const reports = async (Tenant: Tenants) => {
    const Dates = formatDates(new Date('2024-11-17')).toString() ?? new Date()
    let PreviousDate: any = new Date(Dates)
    PreviousDate.setDate(PreviousDate.getDate() - 1)
    PreviousDate = formatDates(PreviousDate)

    const SalesType = tenant?.SMSalesType ?? 'NA'
    const BatchNo = 17 //batchNo + 1
    const MallPartnerCodeId = String(tenant?.TenantCode)
      .slice(0, 8)
      .replace(/[^a-zA-Z0-9]/g, '')
      .padEnd(8, '0')
    switch (Tenant) {
      case Tenants.SM:
        const transactionsQuery = SIATransactions({ Terminal, SMPOSSerialNumber, SalesType })
        await window.electron.sql.get(
          SqlChannel.getSIATransactions,
          `${path}/SIA`,
          transactionsQuery
        )
        const transactionsDetailsQuery = SIATransactionDetailQuery({ Terminal })
        await window.electron.sql.get(
          SqlChannel.getSIATransactionDetails,
          `${path}/SIA`,
          transactionsDetailsQuery
        )
        break
      case Tenants.ALLIANCE:
        //do something here
        //(DSum("expr1","RepPOS (Z Reading Z-Counter)")+Nz(DFirst("ZCounterEnd","SysCurrent"),0)) AS Zcounter
        break
      case Tenants.AYALA:
        //do something here
        break
      case Tenants.RLC:
        //do something here
        break
      case Tenants.MW:
        try {
          // DAILY DISCOUNTS
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
          const ControlNoQuery = ControlNumberQuery({ Terminal })
          const ControlNoResponse = await window.electron.sql.get(
            SqlChannel.getAmount,
            ControlNoQuery
          )
          const ControlNumber = ControlNoResponse?.Data?.ControlNumber ?? 0
          console.log('ControlNumber:', ControlNumber)
          /*const PreviousReadingQ = PreviousReading({ PreviousDate, Terminal })
          const PreviousReadingResponse = await window.electron.sql.get(
            SqlChannel.getAmount,
            PreviousReadingQ
          )*/
          const OldAccumulatedTotal = ControlNoResponse?.Data?.PreviousReading ?? 0
          console.log('OldAccumulatedTotal:', OldAccumulatedTotal)
          const VATAmountQuery: string = TaxAmountQuery({ Dates, Terminal })
          const VATAmountResponse = await window.electron.sql.get(
            SqlChannel.getAmount,
            VATAmountQuery
          )

          const GrossSalesQ = GrossSalesQuery({ Dates, Terminal })
          const GrossSalesResponse = await window.electron.sql.get(
            SqlChannel.getAmount,
            GrossSalesQ
          )

          const GrossSalesAmount =
            Math.round((GrossSalesResponse?.Data?.GrossSales ?? 0) * 100) / 100
          console.log('GrossSalesAmount:', GrossSalesAmount)
          const VatExempt = VATAmountResponse?.Data?.VatExempt ?? 0 //NOnVatSales
          const VATAmount = Math.round((GrossSalesResponse?.Data?.TaxAmount ?? 0) * 100) / 100
          /*let VATAmount =
            (GrossSalesAmount -
              (VATAmountResponse?.Data?.VatExempt ??
                0 + VATAmountResponse?.Data?.AdjustmentAmount ??
                0 + VATAmountResponse?.Data?.DisablityDiscount ??
                0 + VATAmountResponse?.Data?.GrossSalesAmountNotSubjectToPercentageRent ??
                0) /
                1.12) *
            0.12
          VATAmount = Math.round((VATAmount ?? 0) * 100) / 100*/
          console.log('VATAmount:', VATAmount)
          const ServiceChargeQ: string = ServiceChargeQuery({ Dates, Terminal })
          const ServiceChargeResponse = await window.electron.sql.get(
            SqlChannel.getAmount,
            ServiceChargeQ
          )

          const ServiceChargeAmount =
            Math.round((ServiceChargeResponse?.Data?.ServiceCharge ?? 0) * 100) / 100
          console.log('ServiceChargeAmount:', ServiceChargeAmount)
          const RefundAmount = Math.round((GrossSalesResponse?.Data?.RefundAmount ?? 0) * 100) / 100
          console.log('RefundAmount:', RefundAmount)
          const VoidAmount = Math.round((GrossSalesResponse?.Data?.VoidAmount ?? 0) * 100) / 100
          console.log('VoidAmount:', VoidAmount)
          const NetSalesAmount = Math.round((GrossSalesResponse?.Data?.NetSales ?? 0) * 100) / 100
          console.log('NetSalesAmount:', NetSalesAmount)
          const NewAccumulatedTotal: number =
            Math.round((NetSalesAmount + OldAccumulatedTotal) * 100) / 100
          console.log('NewAccumulatedTotal:', NewAccumulatedTotal)
          const PaymentSalesQ = PaymentSalesQuery({ Dates, Terminal })
          const PaymentSalesReponse = await window.electron.sql.get(
            SqlChannel.getAmount,
            PaymentSalesQ
          )

          const CashSales = Math.round((PaymentSalesReponse?.Data?.CashSales ?? 0) * 100) / 100
          console.log('CashSales:', CashSales)
          const CreditDebitsales =
            Math.round((PaymentSalesReponse?.Data?.CreditDebitsales ?? 0) * 100) / 100
          console.log('CreditDebitsales:', CreditDebitsales)
          const OtherPaymentSales =
            Math.round((PaymentSalesReponse?.Data?.OtherPaymentSales ?? 0) * 100) / 100
          console.log('OtherPaymentSales:', OtherPaymentSales)
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
          // END DAILY SALES
          //dispatch(setBatchNo(3))
        } catch (error: any) {
          console.error(error.message)
          dispatch(setSnackbar({ display: true, message: Error.e00x01, type: ToastType.error }))
        }
        break
    }
  }

  const loadData = async () => {
    try {
      await reports(activeTenant)
    } catch (error: any) {
      dispatch(setSnackbar({ display: true, message: Error.e00x01, type: ToastType.error }))
    }
  }

  useEffect(() => {
    if (!initialized) return
    else loadData()
    const interval = setInterval(() => {
      loadData()
    }, 60000 * 5)
    return () => clearInterval(interval)
  }, [initialized, tenant, path])

  return (
    <>
      <S.Container className={className}>
        <S.Text>
          <S.Icon path={mdiInformation} size="30px" />
          <S.Span> Prior to starting, the things listed above must be set.</S.Span>
        </S.Text>
        {initialized && (
          <>
            <S.Div>
              <S.DivBtn2>
                <S.Button
                  onClick={handlePause}
                  iconLeft={mdiPause}
                  text="Pause"
                  color={ButtonColor.green}
                />
              </S.DivBtn2>
              <S.DivBtn>
                <S.Button
                  onClick={handleRestart}
                  iconLeft={mdiRestart}
                  text="Restart"
                  color={ButtonColor.blue}
                />
              </S.DivBtn>
            </S.Div>
          </>
        )}
        {!initialized && (
          <S.Button
            onClick={handleInitialize}
            iconLeft={mdiPlay}
            text="Start"
            color={ButtonColor.blue}
          />
        )}
      </S.Container>
      {renderLoadingScreen()}
    </>
  )
}
