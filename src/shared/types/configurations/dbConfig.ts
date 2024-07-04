import { ConnectionPool } from 'mssql'

export interface DBConfig {
  server: string
  name: string
  user: string
  password: string
  port: number
}

export const initialValues: DBConfig = {
  server: '',
  name: '',
  user: '',
  password: '',
  port: 0
}

export interface DatabaseConnection {
  pool: ConnectionPool
  isConnected: boolean
}
