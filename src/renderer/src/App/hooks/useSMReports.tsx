import { Error } from '@shared/messages'
import { SIATransactionDetailQuery, SIATransactions } from '@shared/query'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SqlChannel, Tenant, ToastType } from '@shared/types'
import { windowNotification } from '@shared/utils'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const useSMReports = () => {
  const dispatch = useDispatch<AppDispatch>()

  const createReport = useCallback(
    async (path: string, tenant: Tenant, Dates: string) => {
      const { Terminal = 1, SMPOSSerialNumber = '000000', SMSalesType = 'NA' } = tenant

      try {
        // Generate SIATransactions report
        const transactionsQuery = SIATransactions({
          Terminal,
          SMPOSSerialNumber,
          SalesType: SMSalesType,
          Dates
        })

        const trnResult = await window.electron.sql.get(
          SqlChannel.getSIATransactions,
          String(`${path}/SIA`).replace('\\', '/'),
          transactionsQuery,
          Dates
        )
        //console.log(trnResult)
        // Generate SIATransactionDetails report
        const transactionsDetailsQuery = SIATransactionDetailQuery({ Terminal, Dates })

        const trnDetailResult = await window.electron.sql.get(
          SqlChannel.getSIATransactionDetails,
          String(`${path}/SIA`).replace('\\', '/'),
          transactionsDetailsQuery,
          Dates
        )
        if (trnResult.IsSomething && trnDetailResult.IsSomething)
          // Success notification
          windowNotification(
            'SM Reports',
            'New reports have been created.',
            String(`${path}/SIA`).replace('\\', '/')
          )
        else
          dispatch(
            setSnackbar({
              display: true,
              message: trnResult.Message || Error.e00x01,
              type: ToastType.error
            })
          )
      } catch (error: any) {
        console.error('Report creation failed:', error)

        // Failure notification
        windowNotification('SM Reports Failed', error.message || 'An unknown error occurred')

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
