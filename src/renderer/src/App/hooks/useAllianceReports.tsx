import { Error } from '@shared/messages'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SqlChannel, Tenant, ToastType } from '@shared/types'
import { windowNotification } from '@shared/utils'
import { Buffer } from 'buffer'
import html2pdf from 'html2pdf.js'
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
      ReportType: string,
      IsZReading?: boolean,
      element?: any
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

        if (IsZReading && element) {
          const options = {
            margin: 0.1,
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' as const }
          }
          const pdfBlob = await html2pdf().from(element).set(options).outputPdf('blob')
          const arrayBuffer = await pdfBlob.arrayBuffer()
          // For Alliance, we don't have a BatchNo explicitly, so we pass 0 or a similar batch identifier
          await globalThis.electron.sql.post(
            SqlChannel.getZReading,
            tenant,
            typeof Dates === 'string' ? Dates : Dates.DateStart,
            0,
            {
              buffer: Buffer.from(arrayBuffer),
              targetDir: path
            }
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
