import { io, Socket } from 'socket.io-client'
import { BrowserWindow } from 'electron'
import { SocketChannel } from '@shared/constants'

/**
 * Socket Service — Manages the real-time connection to the backend server.
 * Listens for server-side events and broadcasts them to the renderer via IPC.
 */
class SocketService {
  private socket: Socket | null = null
  private mainWindow: BrowserWindow | null = null
  private url: string = 'http://localhost:3000' // TODO: Move to config/dotenv

  /**
   * Initializes the socket client and event listeners.
   */
  init(window: BrowserWindow, token?: string): void {
    this.mainWindow = window

    if (this.socket?.connected) return

    this.socket = io(this.url, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000
    })

    this.setupListeners()
  }

  /**
   * Registers listeners for specific server events.
   */
  private setupListeners(): void {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to server')
      this.broadcast('socket:connected', { id: this.socket?.id })
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
      this.broadcast('socket:disconnected', { reason })
    })

    // Example Application Events
    this.socket.on('notification:new', (data) => {
      console.log('[Socket] New notification received:', data)
      this.broadcast(SocketChannel.newNotification, data)
    })

    this.socket.on('price:update', (data) => {
      console.log('[Socket] Price update received:', data)
      this.broadcast(SocketChannel.priceUpdate, data)
    })
  }

  /**
   * Sends an IPC message to the renderer process.
   */
  private broadcast(channel: string, data: any): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel, data)
    }
  }

  /**
   * Public broadcast method for local Main process services.
   */
  public broadcastLocal(channel: string, data: any): void {
    this.broadcast(channel, data)
  }

  /**
   * Sends a message back to the server.
   */
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    }
  }

  /**
   * Closes the socket connection.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export default new SocketService()
