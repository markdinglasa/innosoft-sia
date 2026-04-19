import { useMasterfile } from '../../../hooks/use-masterfile'
import { IpcChannel } from '@shared/types'
import { useMutation } from '@tanstack/react-query'
import { displayToast } from '@shared/utils'
import { ToastType } from '@shared/types'

export const useDisbursement = () => {
  const masterfile = useMasterfile('disbursement')

  // Additional disbursement-specific hook for printing
  const usePrintReceipt = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await (window as any).electron.ipc.invoke(IpcChannel.mstList, {
          serviceName: 'print-disbursement', // Mocking a specialized service or IPC channel
          options: { id }
        })
        if (!response.success) throw new Error(response.message)
        return response.data
      },
      onSuccess: () => {
        displayToast('Receipt sent to printer.', ToastType.success)
      },
      onError: (error: Error) => {
        displayToast(error.message || 'Failed to print receipt.', ToastType.error)
      }
    })
  }

  return {
    ...masterfile,
    usePrintReceipt
  }
}
