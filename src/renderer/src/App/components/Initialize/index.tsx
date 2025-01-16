import { mdiPause, mdiPlay, mdiRestart } from '@mdi/js'
import { Error } from '@shared/messages'
import { getSettings } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, ButtonColor, SFC, SqlChannel, ToastType } from '@shared/types'
import { formatDates } from '@shared/utils'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAllianceReports, useMWReports, useSMReports } from '../../hooks'
import {
  getActiveTenant,
  getAllianceCategory,
  getAllianceReportType,
  getDateRanges,
  getInitialize,
  getIsConnected,
  getPath,
  getSelectedDate,
  getTenant
} from '../../selectors'
import { setDates, setInitialize } from '../../store/manager'
import { setDateEnd, setDateStart } from '../../store/settings'
import { Tenants } from '../../types'
import { LoadingScreen } from '../LoadingScreen'
import { ZReading } from '../ZReading'
import * as S from './Styles'

export const Initialize: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const dates = useSelector(getSelectedDate)
  const Dates = formatDates(new Date(dates ?? new Date())).toString()
  const [optDate, setOptDate] = useState<string | null>(null)
  //console.log('Dates: ', Dates)
  const settings = useSelector(getSettings)
  const [loading, setLoading] = useState<boolean>(false)
  const path = useSelector(getPath)
  const isConnected = useSelector(getIsConnected)
  const tenant = useSelector(getTenant)
  const dateRanges = useSelector(getDateRanges)
  const initialized = useSelector(getInitialize)
  const activeTenant = useSelector(getActiveTenant)
  const allianceCategory = useSelector(getAllianceCategory)
  const reportType = useSelector(getAllianceReportType)
  const pointerRef = useRef<HTMLDivElement>(null)

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
  const element = pointerRef.current
  const reports = async (Tenant: Tenants, OptDate?: string | null) => {
    const currentDate = formatDates(new Date(OptDate ?? Dates)).toString()
    switch (Tenant) {
      case Tenants.SM:
        SMReports(path, tenant, currentDate)
        break
      case Tenants.ALLIANCE:
        AllianceReport(path, tenant, currentDate, allianceCategory, reportType)
        break
      /*case Tenants.AYALA:
        dispatch(setSnackbar({ display: true, message: Error.e00x47, type: ToastType.error }))
        break
      case Tenants.RLC:
        dispatch(setSnackbar({ display: true, message: Error.e00x47, type: ToastType.error }))
        break*/
      case Tenants.MW:
        MWReports(path, tenant, currentDate, element, settings.IsZReading)
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
  const handleGenerate = async () => {
    if (!dateRanges.DateStart || !dateRanges.DateEnd) {
      dispatch(
        setSnackbar({ display: true, message: 'Please select a date range', type: ToastType.error })
      )
    } else {
      dispatch(setInitialize(false))
      setLoading(true)
      try {
        if (settings.IsDateRange) {
          for (
            let d = new Date(dateRanges.DateStart);
            d <= new Date(dateRanges.DateEnd);
            d.setDate(d.getDate() + 1)
          ) {
            setOptDate(d.toString())
            await reports(activeTenant, d.toString())
            if (d >= new Date(dateRanges.DateEnd)) {
              break
            }
          }
        }
      } catch (error: any) {
        dispatch(setSnackbar({ display: true, message: Error.e00x01, type: ToastType.error }))
      }
    }
    setTimeout(() => {
      setLoading(false)
    }, 9000)
  }

  useEffect(() => {
    if (!initialized) return
    if (initialized) loadData()
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
        {activeTenant && settings.IsDateRange && (
          <>
            <S.DateRangeCon>
              <S.Div>
                <S.DateCon>
                  <S.Label>Date Start</S.Label>
                  <S.InputDate
                    type="date"
                    name="datestart"
                    value={formatDates(dateRanges.DateStart ?? new Date())}
                    onChange={(e) => dispatch(setDateStart(new Date(e.target.value).toString()))}
                    disabled={initialized}
                  />
                </S.DateCon>
                <S.DateCon>
                  <S.Label>Date End</S.Label>
                  <S.InputDate
                    type="date"
                    name="dateend"
                    value={formatDates(dateRanges.DateEnd ?? new Date())}
                    onChange={(e) => dispatch(setDateEnd(new Date(e.target.value).toString()))}
                    disabled={initialized}
                  />
                </S.DateCon>
              </S.Div>
              <S.DateCon>
                <S.Button
                  onClick={handleGenerate}
                  iconLeft={mdiPlay}
                  text="Generate"
                  color={ButtonColor.blue}
                />
              </S.DateCon>
            </S.DateRangeCon>
          </>
        )}
        {activeTenant && !settings.IsDateRange && (
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
        {initialized && !settings.IsDateRange && (
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
        {!initialized && !settings.IsDateRange && (
          <S.Button
            onClick={handleInitialize}
            iconLeft={mdiPlay}
            text="Start"
            color={ButtonColor.blue}
          />
        )}
      </S.Container>
      {renderLoadingScreen()}
      <div style={{ display: 'none' }}>
        <div ref={pointerRef}>
          <ZReading CurrentDate={optDate ?? Dates} />
        </div>
      </div>
    </>
  )
}
