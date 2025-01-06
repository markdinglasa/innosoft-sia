import { mdiPause, mdiPlay, mdiRestart } from '@mdi/js'
import { Error } from '@shared/messages'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, ButtonColor, SFC, SqlChannel, ToastType } from '@shared/types'
import { formatDates } from '@shared/utils'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAllianceReports, useMWReports, useSMReports } from '../../hooks'
import {
  getActiveTenant,
  getAllianceCategory,
  getAllianceReportType,
  getInitialize,
  getIsConnected,
  getPath,
  getSelectedDate,
  getTenant
} from '../../selectors'
import { setDates, setInitialize } from '../../store/manager'
import { Tenants } from '../../types'
import { LoadingScreen } from '../LoadingScreen'
import * as S from './Styles'

export const Initialize: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const dates = useSelector(getSelectedDate)
  const Dates = formatDates(new Date(dates ?? new Date())).toString()

  const [loading, setLoading] = useState<boolean>(false)
  const path = useSelector(getPath)
  const isConnected = useSelector(getIsConnected)
  const tenant = useSelector(getTenant)

  const initialized = useSelector(getInitialize)
  const activeTenant = useSelector(getActiveTenant)
  const allianceCategory = useSelector(getAllianceCategory)
  const reportType = useSelector(getAllianceReportType)

  const SMReports = useSMReports()
  const AllianceReport = useAllianceReports()
  const MWReports = useMWReports()

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
    if (!isConnected)
      dispatch(setSnackbar({ display: true, message: Error.e00x14, type: ToastType.error }))
    const fieldsValid = await checkFields()
    if (!fieldsValid)
      dispatch(setSnackbar({ display: true, message: Error.e00x44, type: ToastType.error }))
    if (!activeTenant)
      dispatch(setSnackbar({ display: true, message: Error.e00x46, type: ToastType.error }))
    if (!tenant)
      dispatch(setSnackbar({ display: true, message: Error.e00x46, type: ToastType.error }))
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

  const reports = async (Tenant: Tenants) => {
    switch (Tenant) {
      case Tenants.SM:
        SMReports(path, tenant, Dates)
        break
      case Tenants.ALLIANCE:
        AllianceReport(path, tenant, Dates, allianceCategory, reportType)
        break
      /*case Tenants.AYALA:
        dispatch(setSnackbar({ display: true, message: Error.e00x47, type: ToastType.error }))
        break
      case Tenants.RLC:
        dispatch(setSnackbar({ display: true, message: Error.e00x47, type: ToastType.error }))
        break*/
      case Tenants.MW:
        MWReports(path, tenant, Dates)
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
        {/*<S.TopTitle>
          <S.Text>
            <S.Icon path={mdiInformation} size="30px" />
            <S.Span>Before starting, make sure the above items are ready.</S.Span>
          </S.Text>
        </S.TopTitle>*/}
        <S.TopTitle>
          {activeTenant && (
            <>
              <S.Div>
                <S.DivBtn2>
                  <S.InputDate
                    type="date"
                    name="dates"
                    value={formatDates(dates ?? new Date())}
                    onChange={(e) => dispatch(setDates(new Date(e.target.value).toString()))}
                    disabled={initialized}
                  />
                </S.DivBtn2>
                <S.DivBtn>
                  <S.Button
                    onClick={() => dispatch(setDates(null))}
                    text="System Date"
                    //iconLeft={mdiCalendarBlank}
                    color={ButtonColor.blue}
                    disabled={initialized}
                  />
                </S.DivBtn>
              </S.Div>
            </>
          )}
        </S.TopTitle>
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
