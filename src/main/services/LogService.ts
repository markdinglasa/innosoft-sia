import { LogEntry, LogLevel } from '@shared/types'
import log from 'electron-log'
import { v4 as uuidv4 } from 'uuid'

export class LogService {
  private static instance: LogService
  private logs: LogEntry[] = []
  private readonly MAX_LOGS = 200

  private constructor() {
    // electron-log already writes to a file by default
    log.transports.file.level = 'info'
    log.transports.console.level = 'info'
    
    // Auto-capture unhandled errors
    process.on('uncaughtException', (error) => {
      this.error('UncaughtException', error.message, { stack: error.stack })
    })

    process.on('unhandledRejection', (reason: any) => {
      this.error('UnhandledRejection', reason?.message || String(reason), { stack: reason?.stack })
    })
  }

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService()
    }
    return LogService.instance
  }

  public getLogs(): LogEntry[] {
    return this.logs
  }

  public clearLogs(): void {
    this.logs = []
    log.info('Logs cleared by user')
  }

  private addLog(level: LogLevel, source: string, message: string, details?: any): void {
    const entry: LogEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      details: details ? (typeof details === 'string' ? details : JSON.stringify(details)) : undefined
    }

    // Add to memory buffer
    this.logs.unshift(entry)
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.pop()
    }

    // Write to electron-log file
    const logStr = `[${source}] ${message}${details ? ' | ' + JSON.stringify(details) : ''}`
    switch (level) {
      case 'error':
        log.error(logStr)
        break
      case 'warn':
        log.warn(logStr)
        break
      case 'info':
        log.info(logStr)
        break
    }
  }

  public info(source: string, message: string, details?: any): void {
    this.addLog('info', source, message, details)
  }

  public warn(source: string, message: string, details?: any): void {
    this.addLog('warn', source, message, details)
  }

  public error(source: string, message: string, details?: any): void {
    this.addLog('error', source, message, details)
  }
}

export const logger = LogService.getInstance()
