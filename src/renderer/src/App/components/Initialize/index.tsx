import { mdiInformation, mdiPause, mdiPlay, mdiRestart } from '@mdi/js'
import { Error } from '@shared/messages'
import { SIATransactionDetailQuery, SIATransactions } from '@shared/query'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, ButtonColor, SFC, SqlChannel, ToastType } from '@shared/types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getInitialize, getIsConnected, getPath, getTenant } from '../../selectors'
import { setInitialize } from '../../store/manager'
import { LoadingScreen } from '../LoadingScreen'
import * as S from './Styles'

export const Initialize: SFC = ({ className }) => {
  const path = useSelector(getPath)
  const isConnected = useSelector(getIsConnected)
  const tenant = useSelector(getTenant)
  const initialized = useSelector(getInitialize)
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState<boolean>(false)
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
    if (!tenant) {
      dispatch(setSnackbar({ display: true, message: Error.e00x46, type: ToastType.error }))
    }
    if (tenant && fieldsValid && isConnected) {
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

  const loadData = async () => {
    try {
      const Terminal: number = parseInt(tenant.Terminal, 10),
        SMPOSSerialNumber = tenant.POSSerialNumber
      const transactionsQuery = SIATransactions({ Terminal, SMPOSSerialNumber })

      const transactionsResponse: Response = await window.electron.sql.get(
        SqlChannel.getSIATransactions,
        `${path}/SIA`,
        transactionsQuery
      )

      const transactionsDetailsQuery = SIATransactionDetailQuery({ Terminal })
      const transactionDetailsResponse: Response = await window.electron.sql.get(
        SqlChannel.getSIATransactionDetails,
        `${path}/SIA`,
        transactionsDetailsQuery
      )
      console.log(transactionsResponse)
      console.log(transactionDetailsResponse)
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
