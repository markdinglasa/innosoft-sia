import { Error as err } from '@shared/messages'
import { ControlNumberQuery } from '@shared/query'
import { getSettings } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SFC, SqlChannel, ToastType } from '@shared/types'
import { formatDates } from '@shared/utils'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMWReports } from '../../../hooks'
import {
  getDateRanges,
  getPath,
  getSelectedDate,
  getTenant
} from '../../../selectors'
import { AccessControl } from '../../AccessControl'
import { AllianceTenant } from '../../AllicanceTenant'
import { DateRange } from '../../DateRange'
import { LoadingScreen } from '../../LoadingScreen'
import { SingleDate } from '../../SingleDate'
import { ZReading } from '../../ZReading'
import * as S from '../Styles'

export const MegaworldReport: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedDate = useSelector(getSelectedDate)
  const formattedSelectedDate = formatDates(new Date(selectedDate ?? new Date())).toString()

  const settings = useSelector(getSettings)
  const [loading, setLoading] = useState<boolean>(false)
  const path = useSelector(getPath)
  const tenant = useSelector(getTenant)
  const dateRanges = useSelector(getDateRanges)
  const [initialized] = useState<boolean>(false)
  const pointerRef = useRef<HTMLDivElement>(null)

  const MWReports = useMWReports()

  const handleCheckEOD = async (
    Terminal: number = 0,
    SelectedDate: string = formattedSelectedDate
  ): Promise<boolean> => {
    try {
      const ControlNoQuery = ControlNumberQuery({ Terminal, Dates: SelectedDate })
      const ControlNoResponse = await window.electron.sql.get(SqlChannel.getAmount, ControlNoQuery)
      const ControlNumber = ControlNoResponse?.Data?.ControlNumber ?? 0
      if (typeof ControlNumber !== 'number' || ControlNumber === 0) return false
      else return true
    } catch (error: unknown) {
      return false
    }
  }

  const loadData = async (activeDates: string) => {
    try {
      const element = pointerRef.current
      await MWReports(path, tenant, activeDates, element, settings.IsZReading)
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

  const handleSingleGenerate = () => {
    if (!tenant) {
      dispatch(setSnackbar({ display: true, message: err.e00x46, type: ToastType.error }))
      return
    }
    setLoading(true)
    try {
      loadData(formattedSelectedDate)
    } catch (error: unknown) {
      dispatch(
        setSnackbar({
          display: true,
          message: (error as Error).message || err.e00x01,
          type: ToastType.error
        })
      )
    }
    setTimeout(() => {
      setLoading(false)
    }, 9000)
  }

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
          <SingleDate data={selectedDate} isInitialized={initialized} />
        </AccessControl>
        <AccessControl condition={!settings.IsDateRange}>
          <AllianceTenant generate={handleSingleGenerate} />
        </AccessControl>
      </S.Container>
      {loading && <LoadingScreen />}
      <div style={{ display: 'none' }}>
        <div ref={pointerRef}>
          <ZReading CurrentDate={formattedSelectedDate} />
        </div>
      </div>
    </>
  )
}
