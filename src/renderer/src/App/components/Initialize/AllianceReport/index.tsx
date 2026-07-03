import { Error as err } from '@shared/messages'
import { getSettings } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SFC, ToastType } from '@shared/types'
import { formatDates } from '@shared/utils'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAllianceReports } from '../../../hooks'
import {
  getAllianceCategory,
  getAllianceReportType,
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

export const AllianceReport: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const dates = useSelector(getSelectedDate)
  const Dates = formatDates(new Date(dates ?? new Date())).toString()

  const settings = useSelector(getSettings)
  const [loading, setLoading] = useState<boolean>(false)
  const path = useSelector(getPath)
  const tenant = useSelector(getTenant)
  const dateRanges = useSelector(getDateRanges)
  const allianceCategory = useSelector(getAllianceCategory)
  const reportType = useSelector(getAllianceReportType)
  const pointerRef = useRef<HTMLDivElement>(null)

  const AllianceReportHook = useAllianceReports()

  const handleGenerate = async () => {
    if (!tenant) {
      dispatch(setSnackbar({ display: true, message: err.e00x46, type: ToastType.error }))
      return
    }
    if (!dateRanges.DateStart || !dateRanges.DateEnd) {
      dispatch(
        setSnackbar({ display: true, message: 'Please select a date range', type: ToastType.error })
      )
      return
    }
    setLoading(true)
    try {
      if (settings.IsDateRange) {
        await AllianceReportHook(
          path,
          tenant,
          { DateStart: dateRanges.DateStart, DateEnd: dateRanges.DateEnd },
          allianceCategory,
          reportType,
          settings.IsZReading,
          pointerRef.current
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
    setTimeout(() => {
      setLoading(false)
    }, 9000)
  }

  const handleSingleGenerate = async () => {
    if (!tenant) {
      dispatch(setSnackbar({ display: true, message: err.e00x46, type: ToastType.error }))
      return
    }
    setLoading(true)
    try {
      await AllianceReportHook(path, tenant, Dates, allianceCategory, reportType, settings.IsZReading, pointerRef.current)
    } catch (error: unknown) {
      console.log('ERROR: ', (error as Error)?.message)
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
          <DateRange data={dateRanges} isInitialized={false} handleGenerate={handleGenerate} />
        </AccessControl>
        <AccessControl condition={!settings.IsDateRange}>
          <SingleDate data={dates} isInitialized={false} />
        </AccessControl>
        <AccessControl condition={!settings.IsDateRange}>
          <AllianceTenant generate={handleSingleGenerate} />
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
