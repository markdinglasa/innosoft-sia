import { Error } from '@shared/messages'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SqlChannel, Tenant, ToastType } from '@shared/types'
import { windowNotification } from '@shared/utils'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const useAllianceReports = () => {
  const dispatch = useDispatch<AppDispatch>()

  const createReport = useCallback(
    async (
      path: string,
      tenant: Tenant,
      Dates: string | { DateStart: string; DateEnd: string },
      Category: string,
      ReportType: string
    ) => {
      try {
        if (ReportType === 'salesEOD') {
          await globalThis.electron.sql.get(
            SqlChannel.getAllianceSalesEOD,
            tenant,
            `${path}`,
            Dates,
            Category
          )
        } else if (ReportType === 'onlineSalesPREEOD') {
          await globalThis.electron.sql.get(
            SqlChannel.getAllianceOnlineSales,
            tenant,
            `${path}`,
            Dates,
            Category
          )
        }
        // Success notification
        windowNotification('Alliance Reports', 'New reports have been created.', path)
      } catch (error: any) {
        console.error('Report creation failed:', error)

        // Failure notification
        windowNotification('Alliance Reports Failed', error.message || 'An unknown error occurred')

        // Display Snackbar error
        dispatch(
          setSnackbar({
            display: true,
            message: Error.e00x01,
            type: ToastType.error
          })
        )
      }
    },
    [dispatch]
  )

  return createReport
}
