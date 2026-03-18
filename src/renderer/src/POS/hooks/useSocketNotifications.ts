import { SocketChannel } from '@shared/constants'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

/**
 * Hook to handle real-time notifications from the WebSocket server.
 * Listens for Socket.io events broadcasted via IPC from the main process.
 * Bridges these events directly to react-toastify.
 */
export const useSocketNotifications = () => {
  useEffect(() => {
    // 1. Handle New Notifications
    const onNewNotification = (data: any) => {
      const message = data.message || 'You have a new real-time alert!'
      const type = data.type || 'info'
      
      toast(message, { 
        type: type as any,
        toastId: data.id // Use data.id as toastId to prevent duplicates if provided
      })
    }

    // 2. Handle Price Updates
    const onPriceUpdate = (data: any) => {
      const message = `Price updated for ${data.itemCode}: ${data.newPrice}`
      toast.info(message, {
        toastId: `price-update-${data.itemCode}`
      })
    }

    // Register IPC listeners
    window.electron.ipc.on(SocketChannel.newNotification, onNewNotification as any)
    window.electron.ipc.on(SocketChannel.priceUpdate, onPriceUpdate as any)

    // Cleanup listeners on unmount
    return () => {
      window.electron.ipc.removeListener(SocketChannel.newNotification, onNewNotification as any)
      window.electron.ipc.removeListener(SocketChannel.priceUpdate, onPriceUpdate as any)
    }
  }, [])
}
