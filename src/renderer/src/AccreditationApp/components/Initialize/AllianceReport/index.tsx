import { Error as err } from '@shared/messages'
import { ControlNumberQuery } from '@shared/query'
import { getSettings } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SFC, SqlChannel, ToastType } from '@shared/types'
import { formatDates } from '@shared/utils'
import { useState } from 'react'
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

  const AllianceReportHook = useAllianceReports()

  const handleCheckEOD = async (
    Terminal: number = 0,
    SelectedDate: string = ''
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
      await AllianceReportHook(path, tenant, activeDates, allianceCategory, reportType)
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
      loadData(Dates)
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
            isInitialized={false}
            handleGenerate={handleGenerate}
          />
        </AccessControl>
        <AccessControl condition={!settings.IsDateRange}>
          <SingleDate data={dates} isInitialized={false} />
        </AccessControl>
        <AccessControl condition={!settings.IsDateRange}>
          <AllianceTenant generate={handleSingleGenerate} />
        </AccessControl>
      </S.Container>
      {loading && <LoadingScreen />}
    </>
  )
}
