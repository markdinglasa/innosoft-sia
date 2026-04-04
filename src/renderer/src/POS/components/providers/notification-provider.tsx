import React, { createContext, useContext, useEffect, useState } from 'react'
import { Snackbar, Alert, AlertTitle, Box, Typography } from '@mui/material'
import { SocketChannel } from '@shared/constants'

interface NotificationContextType {
  notify: (message: string, type?: 'success' | 'info' | 'warning' | 'error', title?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
    title?: string
  }>({
    message: '',
    type: 'info'
  })

  const notify = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', title?: string) => {
    setNotification({ message, type, title })
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  useEffect(() => {
    // Listen for low stock alerts from Main Process
    const removeLowStockListener = (window as any).electron.ipc.on(SocketChannel.lowStock, (data: any) => {
      notify(
        `Item "${data.itemName}" has only ${data.remaining} remaining (Threshold: ${data.threshold}).`,
        'warning',
        'Low Stock Alert'
      )
    })

    // Listen for shift discrepancy alerts
    const removeShiftListener = (window as any).electron.ipc.on(SocketChannel.shiftDiscrepancy, (data: any) => {
      notify(
        `Shift discrepancy detected for terminal ${data.terminalName}. Expected: ${data.expected}, Actual: ${data.actual}`,
        'error',
        'Shift Discrepancy'
      )
    })

    return () => {
      removeLowStockListener()
      removeShiftListener()
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={notification.type} variant="filled" sx={{ width: '100%' }}>
          {notification.title && <AlertTitle>{notification.title}</AlertTitle>}
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotification must be used within a NotificationProvider')
  return context
}
