import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { IpcResponseItem } from '@shared/types'
type UseIpcInvokeReturn<T, Args extends any[]> = {
  data: T | null
  error: IpcResponseItem['error'] | null
  loading: boolean
  execute: (...args: Args) => Promise<T | null>
}

/**
 * A React hook for wrapping Electron ipcRenderer.invoke calls that use the standardized IpcResponseItem format.
 * Automatically handles loading states and displays errors via react-toastify.
 *
 * @param channel The IPC channel to invoke
 * @param showToastOnError Whether to automatically show a toast notification on error (default: true)
 */
export function useIpcInvoke<T = any, Args extends any[] = any[]>(
  channel: string,
  showToastOnError: boolean = true
): UseIpcInvokeReturn<T, Args> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<IpcResponseItem['error'] | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setLoading(true)
      setError(null)

      try {
        const response: IpcResponseItem<T> = await window.electron.ipc.invoke(channel, ...args)

        if (response.success) {
          setData(response.data as T)
          return response.data as T
        } else {
          setError(response.error)
          if (showToastOnError && response.error) {
            toast.error(response.error.message || 'An error occurred')
          }
          return null
        }
      } catch (err: any) {
        // This catches hard IPC errors (e.g. channel not found) rather than expected AppExceptions
        const fallbackError = {
          message: err.message || 'Failed to communicate with main process',
          statusCode: 500,
          metadata: err
        }
        setError(fallbackError)
        if (showToastOnError) {
          toast.error(fallbackError.message)
        }
        return null
      } finally {
        setLoading(false)
      }
    },
    [channel, showToastOnError]
  )

  return { data, error, loading, execute }
}
