import { ConnectivityChannel } from '@shared/constants'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

/**
 * Hook to fetch data with optimistic merging of pending offline sync items.
 * Use this to ensure that records created/updated offline are visible in the UI
 * before they are successfully synced to the server.
 */
export const useSyncData = <T extends { id?: number | string }>(tableName: string) => {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const isOnline = useSelector((state: any) => state.POS.sync.isOnline)

  const fetchData = useCallback(async (fetcher: () => Promise<T[]>) => {
    setIsLoading(true)
    try {
      // 1. Fetch "base" data (from Server if online, or Mirror if offline)
      const baseData = await fetcher()

      // 2. Fetch pending local items from SyncQueue via IPC
      const pendingItems: any[] = await window.electron.ipc.invoke(
        ConnectivityChannel.getPendingByTable, 
        tableName
      )

      // 3. Merge logic
      // - For CREATE: add to list
      // - For UPDATE: replace in list
      // - For DELETE: remove from list
      let mergedData = [...baseData]

      for (const item of pendingItems) {
        const payload = JSON.parse(item.payload)
        const entityId = item.entityId
        
        switch (item.operation) {
          case 'CREATE':
            // Add if not already present (based on some temporary ID or property)
            mergedData.unshift({ ...payload, _isPending: true } as T)
            break
          case 'UPDATE':
            // Find by ID and replace
            mergedData = mergedData.map(d => 
              (String(d.id) === String(entityId)) ? { ...d, ...payload, _isPending: true } : d
            )
            break
          case 'DELETE':
            // Filter out by ID
            mergedData = mergedData.filter(d => String(d.id) !== String(entityId))
            break
        }
      }

      setData(mergedData)
    } catch (err) {
      console.error(`[useSyncData] Failed to fetch/merge data for ${tableName}:`, err)
    } finally {
      setIsLoading(false)
    }
  }, [tableName])

  return { data, isLoading, fetchData, isOnline }
}
