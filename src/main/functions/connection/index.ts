import { ConnectionPool } from 'mssql'

export interface DatabaseConnection {
  pool: ConnectionPool
  isConnected: boolean
}

export const Connection = async (): Promise<DatabaseConnection> => {
  try {
    const config = {
      user: 'sa',
      password: 'innosoft',
      server: 'localhost',
      database: 'pos13',
      port: 1433, // Corrected the port parsing
      options: {
        encrypt: false
      }
    }

    const pool = await new ConnectionPool(config).connect()
    pool.setMaxListeners(15)

    // Check the database connection by executing a simple query
    const result = await pool.query`SELECT 1 AS Result`

    // Check if the query returned a result
    const isConnected = result.recordset.length > 0

    return { pool, isConnected }
  } catch (error) {
    throw new Error(`Database connection error: ${error}`)
  }
}
