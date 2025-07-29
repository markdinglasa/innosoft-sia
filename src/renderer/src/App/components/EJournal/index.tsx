import { mdiPlay } from '@mdi/js'
import { Error as err } from '@shared/messages'
import { getSettings } from '@shared/selectors/state'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, ButtonColor, SFC, SqlChannel, ToastType } from '@shared/types'
import { formatDates, windowNotification } from '@shared/utils'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InvoiceFooter } from '../../modals/SettingsForm'
import { getPath } from '../../selectors'
import { LoadingScreen } from '../LoadingScreen'
import * as S from './Styles'
export const EJournal: SFC = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>(formatDates(new Date()))
  const [endDate, setEndDate] = useState<string>(formatDates(new Date()))
  const path = useSelector(getPath)
  const settings = useSelector(getSettings)

  const renderLoadingScreen = () => {
    if (isLoading) return <LoadingScreen message="Generating E-Journal..." />
    return null
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      // Validate dates

      if (!startDate || !endDate || !path) {
        setIsLoading(false)
        dispatch(
          setSnackbar({
            display: true,
            message: 'Please select both start and end dates.',
            type: ToastType.error
          })
        )
        return
      }
      // max cap should only 1yr /365` days
      /*const diffInDays =
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      if (diffInDays > 366) {
        setIsLoading(false)
        dispatch(
          setSnackbar({
            display: true,
            message: '1 month or 30 days is the max dates for generating e-journal',
            type: ToastType.error
          })
        )
        return
      }*/
      if (new Date(startDate) > new Date(endDate)) {
        setIsLoading(false)
        dispatch(
          setSnackbar({
            display: true,
            message: 'Start date cannot be later than end date.',
            type: ToastType.error
          })
        )
        return
      }

      const header = `
--------------------------------------------
${settings?.Name ?? ''}
Operated By: ${settings?.Operator ?? ''}
TIN: ${settings?.TIN ?? ''}
P. No.: ${settings?.PermitNumber ?? ''}
A. No.: ${settings?.AccreditationNumber ?? ''}
S. No.: ${settings?.SerialNumber ?? ''}
M. No.: ${settings?.MachineNumber ?? ''}`

      // this will call the main process to generate the E-Journal report
      const response = await window.electron.sql.get(SqlChannel.E_JOURNAL, {
        dateStart: startDate,
        dateEnd: endDate,
        targetDir: path,
        header: header,
        footer: settings?.InvoiceFooter ?? InvoiceFooter
      })
      if (!response.IsSomething) {
        setIsLoading(false)
        dispatch(
          setSnackbar({
            display: true,
            message: response.Message || err.e00x01,
            type: ToastType.error
          })
        )
      } else {
        setIsLoading(false)
        dispatch(
          setSnackbar({
            display: true,
            message: 'E-Journal Report Created Successfully',
            type: ToastType.success
          })
        )
      }
    } catch (error: unknown) {
      console.error('Report creation failed:', error)

      // Failure notification
      windowNotification('E-Journal Report Failed', (error as Error).message || 'An error occurred')

      // Display Snackbar error
      dispatch(
        setSnackbar({
          display: true,
          message: err.e00x01,
          type: ToastType.error
        })
      )
    }
  }
  return (
    <>
      <S.Container className={className}>
        <S.Div>
          <S.DateRange>
            <S.DateCon>
              <S.Label>Date Start</S.Label>
              <S.InputDate
                type="date"
                name="datestart"
                value={formatDates(new Date(startDate))}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </S.DateCon>
            <S.DateCon>
              <S.Label>Date End</S.Label>
              <S.InputDate
                type="date"
                name="dateend"
                value={formatDates(new Date(endDate))}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </S.DateCon>
          </S.DateRange>
          <S.Button
            onClick={handleGenerate}
            iconLeft={mdiPlay}
            text="Generate"
            color={ButtonColor.blue}
          />
        </S.Div>
      </S.Container>
      {renderLoadingScreen()}
    </>
  )
}
