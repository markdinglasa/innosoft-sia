export const SocketChannel = {
  newNotification: 'socket:notification:new',
  priceUpdate: 'socket:price:update',
  lowStock: 'socket:inventory:low-stock',
  shiftDiscrepancy: 'socket:shift:discrepancy',
  connected: 'socket:connected',
  disconnected: 'socket:disconnected'
} as const
