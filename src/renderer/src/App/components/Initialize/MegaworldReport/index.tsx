import { Error as err } from '@shared/messages'
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
import { AllianceTenant } from "../../AllicanceTenant"
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

  const { createReport, BatchNo } = useMWReports()


  const loadData = async (activeDates: string) => {
    try {
      const element = pointerRef.current
      await createReport(path, tenant, activeDates, element, settings.IsZReading)
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
          const startDate = formatDates(new Date(dateRanges.DateStart))
          const endDate = formatDates(new Date(dateRanges.DateEnd))
          
          await window.electron.sql.get(
            SqlChannel.generateMegaworldRange,
            startDate,
            endDate,
            tenant,
            path,
            BatchNo,
            settings.IsZReading
          )
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
