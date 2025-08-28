import { Error as err } from '@shared/messages'
import { ControlNumberQuery } from '@shared/query'
import { getSettings } from '@shared/selectors'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SFC, SqlChannel, ToastType } from '@shared/types'
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
import { setInitialize } from '../../store/manager'
import { Tenants } from '../../types'
import { AccessControl } from '../AccessControl'
import { AllianceTenant } from '../AllicanceTenant'
import { DateRange } from '../DateRange'
import { LoadingScreen } from '../LoadingScreen'
import { SingleDate } from '../SingleDate'
import { SMTenant } from '../SMTenant'
import { ZReading } from '../ZReading'
import * as S from './Styles'

// eslint-disable-next-line react/prop-types
export const Initialize: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const dates = useSelector(getSelectedDate)
  const Dates = formatDates(new Date(dates ?? new Date())).toString()

  //const [optDate, setOptDate] = useState<string | null>(null)
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

  const checkFields = async (): Promise<boolean> => {
    try {
      if (!path) return false
      const response = await window.electron.sql.get(SqlChannel.checkFields, path)
      if (!response.IsSomething) return false
      return true
    } catch (error: unknown) {
      return false
    }
  }

  const renderLoadingScreen = () => {
    if (loading) return <LoadingScreen />
    return null
  }

  const handleInitialize = async () => {
    if (!isConnected)
      dispatch(setSnackbar({ display: true, message: err.e00x14, type: ToastType.error }))
    const fieldsValid = await checkFields()
    if (!fieldsValid)
      dispatch(setSnackbar({ display: true, message: err.e00x44, type: ToastType.error }))
    if (!activeTenant)
      dispatch(setSnackbar({ display: true, message: err.e00x46, type: ToastType.error }))
    if (!tenant)
      dispatch(setSnackbar({ display: true, message: err.e00x46, type: ToastType.error }))
    const isEOD = await handleCheckEOD(tenant.Terminal, Dates)
    if (!isEOD) {
      dispatch(setSnackbar({ display: true, message: err.e00x48, type: ToastType.error }))
    }
    if (tenant && fieldsValid && isConnected && activeTenant && isEOD) {
      dispatch(setInitialize(true))
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
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
      }, 1000)
    } else {
      dispatch(setSnackbar({ display: true, message: err.e00x01, type: ToastType.error }))
    }
  }
  const element = pointerRef.current

  const reports = async (Tenant: Tenants, OptDate: string) => {
    const currentDate = formatDates(new Date(OptDate)).toString()
    switch (Tenant) {
      case Tenants.SM:
        SMReports(path, tenant, currentDate)
        break
      case Tenants.ALLIANCE:
        AllianceReport(path, tenant, currentDate, allianceCategory, reportType)
        break
      /*case Tenants.AYALA:
        dispatch(setSnackbar({ display: true, message: err.e00x47, type: ToastType.error }))
        break
      case Tenants.RLC:
        dispatch(setSnackbar({ display: true, message: err.e00x47, type: ToastType.error }))
        break*/
      case Tenants.MW:
        MWReports(path, tenant, currentDate, element, settings.IsZReading)
        break
    }
  }

  const loadData = async () => {
    try {
      await reports(activeTenant, Dates)
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

  // use to continues generate of reports in date-range
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
            //setOptDate(d.toString())
            const isEOD = await handleCheckEOD(tenant.Terminal, formatDates(d).toString())
            if (isEOD) {
              await reports(activeTenant, d.toString())
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

  //
  // use for single generate of reports
  const handleSingleGenerate = () => {
    setLoading(true)
    try {
      loadData()
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
        <AccessControl condition={activeTenant && settings.IsDateRange}>
          <DateRange
            data={dateRanges}
            isInitialized={initialized}
            handleGenerate={handleGenerate}
          />
        </AccessControl>
        <AccessControl condition={activeTenant && !settings.IsDateRange}>
          <SingleDate data={dates} isInitialized={initialized} />
        </AccessControl>
        <AccessControl condition={!settings.IsDateRange && String(activeTenant) === Tenants.SM}>
          <SMTenant
            pause={handlePause}
            reStart={handleRestart}
            start={handleInitialize}
            isStarted={initialized}
          />
        </AccessControl>
        <AccessControl
          condition={!settings.IsDateRange && String(activeTenant) === Tenants.ALLIANCE}
        >
          <AllianceTenant generate={handleSingleGenerate} />
        </AccessControl>
      </S.Container>
      {renderLoadingScreen()}
      <div style={{ display: 'none' }}>
        <div ref={pointerRef}>
          <ZReading CurrentDate={Dates} />
        </div>
      </div>
    </>
  )
}
