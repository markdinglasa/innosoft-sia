import { Error } from '@shared/messages'
import { SIATransactionDetailQuery, SIATransactions } from '@shared/query'
import { setSnackbar } from '@shared/store/manager'
import { AppDispatch, SqlChannel, Tenant, ToastType } from '@shared/types'
import { windowNotification } from '@shared/utils'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const useSMReports = (path: string, tenant: Tenant) => {
  const dispatch = useDispatch<AppDispatch>()

  const { TerminalId = 0, SMPOSSerialNumber = 0, SMSaleType = '' } = tenant

  const createReport = useCallback(async () => {
    try {
      // Generate SIATransactions report
      const transactionsQuery = SIATransactions({
        Terminal: TerminalId,
        SMPOSSerialNumber,
        SalesType: SMSaleType
      })

      await window.electron.sql.get(SqlChannel.getSIATransactions, `${path}/SIA`, transactionsQuery)

      // Generate SIATransactionDetails report
      const transactionsDetailsQuery = SIATransactionDetailQuery({ Terminal: TerminalId })

      await window.electron.sql.get(
        SqlChannel.getSIATransactionDetails,
        `${path}/SIA`,
        transactionsDetailsQuery
      )

      // Success notification
      windowNotification('SM Reports', 'New reports have been created.', `${path}/SIA`)
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
  }, [path, TerminalId, SMPOSSerialNumber, SMSaleType, dispatch])

  return createReport
}
