import { mdiInformation, mdiPause, mdiPlay } from '@mdi/js'
import { Error } from '@shared/messages'
import { SIA_QUERY } from '@shared/query/SIAQuery'
import { setSnackbar } from '@shared/store/manager'
import { ButtonColor, SFC, Snackbar, SqlChannel, ToastType, WindowDispatch } from '@shared/types'
import { displayToast } from '@shared/utils'
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
  const dispatch = useDispatch<WindowDispatch>()
  const [loading, setLoading] = useState<boolean>(false)
  let sb: Snackbar
  const checkFields = async (): Promise<boolean> => {
    try {
      if (!path) return false;
      const response: any = await window.electron.sql.get(SqlChannel.checkFields, path)
      if (!response.IsSomething)  return false
      return true
    } catch (error: any) {
      console.log('Check Fields & Path: ' + error)
      return false
    }
  }

  const renderLoadingScreen = () => {
    if (loading) return <LoadingScreen />
    return null
  }

  const handleInitialize = async () => {
    if (!isConnected) displayToast('Path is missing', ToastType.error)
    const fieldsValid = await checkFields()
    if (!fieldsValid) displayToast('Database is not connected', ToastType.error)
    if (!tenant) displayToast('Tenant details are missing', ToastType.error)
    if (tenant && fieldsValid && isConnected) {
      dispatch(setInitialize(true))
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
    }, 9000)
    }
  }

  const handlePause = () => {
    if (initialized) {
      dispatch(setInitialize(false))
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 9000)
    } else {
      sb = {display: true, message: Error.e00x01, type: ToastType.error}
      dispatch(setSnackbar(sb))
    }
  }
  
  useEffect(() => {
    if (!initialized) return;
    const loadData = async () => {
      try {
        let Terminal: number = parseInt(tenant.Terminal, 10), SMPOSSerialNumber = tenant.POSSerialNumber;
        const query = SIA_QUERY({ Terminal, SMPOSSerialNumber });
        const SIATransactions: Response = await window.electron.sql.get(SqlChannel.getSIA, `${path}/SIA`, query);
        console.log(SIATransactions)
      } catch (error: any) {
        sb = {display: true, message: Error.e00x01, type: ToastType.error}
        dispatch(setSnackbar(sb))
      }
    };
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 60000 * 5);
    return () => clearInterval(interval);
  }, [initialized, tenant, path]);

  return (
    <>
      <S.Container className={className}>
        <S.Text>
          <S.Icon path={mdiInformation} size="30px" />
          <S.Span> Prior to starting, the things listed above must be set.</S.Span>
        </S.Text>
        {initialized && (
          <S.Button
            onClick={handlePause}
            iconLeft={mdiPause}
            text="Pause"
            color={ButtonColor.green}
          />
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

