import { ConnectionPool } from 'mssql'
import { getConnection } from '../..'
import { DatabaseConnection } from '../../../../shared/types'
export const Connection = async (): Promise<DatabaseConnection> => {
  try {
    const data = getConnection().Data
    const config = {
      user: data.user,
      password: data.password,
      server: data.server,
      database: data.name,
      port: parseInt(data.port, 10),
      options: {
        encrypt: false
      }
    }
    const pool = await new ConnectionPool(config).connect()
    pool.setMaxListeners(15)
    const result = await pool.query`SELECT 1 AS Result`
    const isConnected = result.recordset.length > 0
    return { pool, isConnected }
  } catch (error) {
    throw new Error(`Database connection error: ${error}`)
  }
}
