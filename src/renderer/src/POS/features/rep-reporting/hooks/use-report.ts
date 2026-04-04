import { useQuery } from '@tanstack/react-query'
import { IpcChannel } from '@shared/types'

export const useReport = () => {
  /**
   * Fetches the X-Reading for a specific shift ID.
   */
  const useXReading = (shiftId?: number) => useQuery({
    queryKey: ['x-reading', shiftId],
    queryFn: async () => {
      if (!shiftId) return null
      const response = await (window as any).electron.ipc.invoke(IpcChannel.reportXReading, shiftId)
      if (!response.success) throw new Error(response.message)
      return response.data
    },
    enabled: !!shiftId
  })

  /**
   * Fetches the Z-Reading for a terminal and date.
   */
  const useZReading = (terminalId: number, date: string) => useQuery({
    queryKey: ['z-reading', terminalId, date],
    queryFn: async () => {
      const response = await (window as any).electron.ipc.invoke(IpcChannel.reportZReading, { terminalId, date })
      if (!response.success) throw new Error(response.message)
      return response.data
    },
    enabled: !!terminalId && !!date
  })

  return { useXReading, useZReading }
}
