import { ConnectionPool } from 'mssql'

export interface DBConfig {
  id: string
  server: string
  name: string
  user: string
  password: string
  port: number
  isActive: boolean
  status?: 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
}

export const initialValues: DBConfig = {
  id: '',
  server: '',
  name: '',
  user: '',
  password: '',
  port: 1433,
  isActive: false
}

export interface DatabaseConnection {
  pool: ConnectionPool
  isConnected: boolean
}
