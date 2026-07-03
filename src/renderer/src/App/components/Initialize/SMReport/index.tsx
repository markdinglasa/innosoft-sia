import { Error as err } from '@shared/messages'
import { ControlNumberQuery } from '@shared/query'
import { getSettings } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SFC, SqlChannel, ToastType } from '@shared/types'
import { formatDates } from '@shared/utils'
import { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSMReports } from '../../../hooks'
import {
  getDateRanges,
  getInitialize,
  getIsConnected,
  getPath,
  getSelectedDate,
  getTenant
} from '../../../selectors'
import { setInitialize } from '../../../store/manager'
import { AccessControl } from '../../AccessControl'
import { DateRange } from '../../DateRange'
import { LoadingScreen } from '../../LoadingScreen'
import { SingleDate } from '../../SingleDate'
import { SMTenant } from '../../SMTenant'
import { ZReading } from '../../ZReading'
import * as S from '../Styles'

export const SMReport: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const dates = useSelector(getSelectedDate)
  const Dates = formatDates(new Date(dates ?? new Date())).toString()

  const settings = useSelector(getSettings)
  const [loading, setLoading] = useState<boolean>(false)
  const path = useSelector(getPath)
  const isConnected = useSelector(getIsConnected)
  const tenant = useSelector(getTenant)
  const dateRanges = useSelector(getDateRanges)
  const initialized = useSelector(getInitialize)
  const pointerRef = useRef<HTMLDivElement>(null)

  const SMReports = useSMReports()

  const handleCheckEOD = async (
    Terminal: number = 0,
    SelectedDate: string = ''
  ): Promise<boolean> => {
    try {
      const ControlNoQuery = ControlNumberQuery({ Terminal, Dates: SelectedDate })
      const ControlNoResponse = await globalThis.electron.sql.get(
        SqlChannel.getAmount,
        ControlNoQuery
      )
      const ControlNumber = ControlNoResponse?.Data?.ControlNumber ?? 0
      if (typeof ControlNumber !== 'number' || ControlNumber === 0) return false
      else return true
    } catch (error: unknown) {
      console.log('ERROR: ', (error as Error)?.message)
      return false
    }
  }

  const checkFields = async (): Promise<boolean> => {
    try {
      if (!path) return false
      const response = await globalThis.electron.sql.get(SqlChannel.checkFields, path)
      if (!response.IsSomething) return false
      return true
    } catch (error: unknown) {
      console.log('ERROR: ', (error as Error)?.message)
      return false
    }
  }

  const handleInitialize = async () => {
    if (!isConnected)
      dispatch(setSnackbar({ display: true, message: err.e00x14, type: ToastType.error }))
    const fieldsValid = await checkFields()
    if (!fieldsValid)
      dispatch(setSnackbar({ display: true, message: err.e00x44, type: ToastType.error }))
    if (!tenant) {
      dispatch(setSnackbar({ display: true, message: err.e00x46, type: ToastType.error }))
      return
    }
    const isEOD = await handleCheckEOD(tenant.Terminal, Dates)
    if (!isEOD) {
      dispatch(setSnackbar({ display: true, message: err.e00x48, type: ToastType.error }))
    }
    if (tenant && fieldsValid && isConnected && isEOD) {
      dispatch(setInitialize(true))
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }

  const handleRestart = () => {
    dispatch(setInitialize(true))
    loadData(Dates)
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
      }, 1000)
    } else {
      dispatch(setSnackbar({ display: true, message: err.e00x01, type: ToastType.error }))
    }
  }

  const loadData = async (activeDates: string) => {
    try {
      await SMReports(path, tenant, activeDates, settings.IsZReading, pointerRef.current)
    } catch (error: unknown) {
      dispatch(
        setSnackbar({
          display: true,
          message: (error as Error).message || err.e00x01,
          type: ToastType.error
        })
      )
    }
  }

  // SONARQUBE ISSUE: Refactor this function to reduce its Cognitive Complexity from 19 to the 15 allowed.
  const handleGenerate = async () => {
    if (!tenant) {
      dispatch(setSnackbar({ display: true, message: err.e00x46, type: ToastType.error }))
      return
    }
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
            const isEOD = await handleCheckEOD(tenant.Terminal, formatDates(d).toString())
            if (isEOD) {
              await loadData(d.toString())
              if (d >= new Date(dateRanges.DateEnd)) {
                break
              }
            }
          }
        }
      } catch (error: unknown) {
        dispatch(
          setSnackbar({
            display: true,
            message: (error as Error).message || err.e00x01,
            type: ToastType.error
          })
        )
      }
    }
    setTimeout(() => {
      setLoading(false)
    }, 9000)
  }

  useEffect(() => {
    if (!initialized) return
    loadData(Dates)
    const interval = setInterval(() => {
      loadData(Dates)
    }, 60000 * 5)
    return () => clearInterval(interval)
  }, [initialized, tenant, path])

  return (
    <>
      <S.Container className={className}>
        <AccessControl condition={settings.IsDateRange}>
          <DateRange
            data={dateRanges}
            isInitialized={initialized}
            handleGenerate={handleGenerate}
          />
        </AccessControl>
        <AccessControl condition={!settings.IsDateRange}>
          <SingleDate data={dates} isInitialized={initialized} />
        </AccessControl>
        <AccessControl condition={!settings.IsDateRange}>
          <SMTenant
            pause={handlePause}
            reStart={handleRestart}
            start={handleInitialize}
            isStarted={initialized}
          />
        </AccessControl>
      </S.Container>
      {loading && <LoadingScreen />}
      <div style={{ display: 'none' }}>
        <div ref={pointerRef}>
          <ZReading CurrentDate={Dates} />
        </div>
      </div>
    </>
  )
}
