import { Error } from '@shared/messages'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SqlChannel, Tenant, ToastType } from '@shared/types'
import { windowNotification } from '@shared/utils'
import { Buffer } from 'buffer'
import html2pdf from 'html2pdf.js'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

export const useMWReports = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [BatchNo, setBatchNo] = useState<number>(1)
  const [previousDate, setPreviousDate] = useState<string | null>(null)

  const createReport = useCallback(
    async (path: string, tenant: Tenant, Dates: string, element: any, IsZReading: boolean) => {
      try {
        const currentDate = new Date(Dates).toDateString()
        if (currentDate === previousDate) setBatchNo(0)
        else {
          setBatchNo((prev) => prev + 1)
          setPreviousDate(currentDate)
        }

        // Generate Daily Discount Report
        await window.electron.sql.get(SqlChannel.getDailyDiscount, tenant, path, BatchNo, Dates)

        // Generate Hourly Sales Report
        await window.electron.sql.get(SqlChannel.getDailyHourlySales, tenant, path, BatchNo, Dates)

        // Generate Daily Sales Report
        await window.electron.sql.get(SqlChannel.getDailySales, tenant, path, BatchNo, Dates)

        if (IsZReading && element) {
          const options = {
            margin: 0.1,
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' as 'portrait' }
          }
          const pdfBlob = await html2pdf().from(element).set(options).outputPdf('blob')
          const arrayBuffer = await pdfBlob.arrayBuffer()
          await window.electron.sql.post(SqlChannel.getZReading, tenant, Dates, BatchNo, {
            buffer: Buffer.from(arrayBuffer),
            targetDir: path
          })
        }

        // Success notification
        windowNotification('Megaworld Reports', 'New reports have been created.', path)
      } catch (error: any) {
        console.error('Report creation failed:', error)

        // Failure notification
        windowNotification('Megaworld Reports Failed', error.message || 'An unknown error occurred')

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
    [dispatch, previousDate, BatchNo]
  )

  return createReport
}
