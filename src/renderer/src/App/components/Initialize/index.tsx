import { mdiInformation, mdiPause, mdiPlay, mdiRestart } from '@mdi/js'
import { Error } from '@shared/messages'
import {
  SIATransactionDetailQuery,
  SIATransactions,
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
import { setBatchNo, setInitialize } from '../../store/manager'
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
    const Dates = formatDates(new Date()).toString() ?? new Date()
    const SalesType = tenant?.SMSalesType ?? 'NA'
    const BatchNo = batchNo + 1
    const MallParnterCodeId = String(tenant.TenantCode)
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
            MallParnterCodeId
          })
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
          const dailySalesQuery: string = mwDailySales({
            Dates,
            Terminal,
            MallParnterCodeId
          })
          await window.electron.sql.get(
            SqlChannel.getDailySales,
            tenant,
            path,
            BatchNo,
            dailySalesQuery
          )
          dispatch(setBatchNo(BatchNo))
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
