export type LogLevel = 'error' | 'warn' | 'info'

export interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  source: string      // e.g., 'SM Report', 'License', 'DB Connection'
  message: string     // The actual error message
  details?: string    // Stack trace or additional context
}
