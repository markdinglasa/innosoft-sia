import { DataSource } from 'typeorm'
import * as Entities from '../entities'
import { getConnection } from '../functions/configuration'

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost', // default settings
  port: 1433, // default settings
  username: 'sa', // default settings
  password: '', // default settings
  database: '', // default settings
  synchronize: true,
  logging: true,
  entities: Object.values(Entities).filter((entity) => typeof entity === 'function'),
  subscribers: [],
  migrations: [],
  extra: {    
    trustServerCertificate: true,
    encrypt: true
  }
})

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    const connectionInfo = getConnection()
    if (!connectionInfo.Data) {
      console.error('Database connection settings are missing:', connectionInfo.Message)
      return
    }

    const { server, port, user, password, name } = connectionInfo.Data

    Object.assign(AppDataSource.options, {
      host: server,
      port: parseInt(port || '1433', 10),
      username: user,
      password: password,
      database: name
    })

    try {
      await AppDataSource.initialize()
      console.log('Data Source has been initialized!')

      // Explicitly run schema synchronization
      await AppDataSource.synchronize()
      console.log('Database schema synchronization complete.')
    } catch (err) {
      console.error('Error during Data Source initialization', err)
      throw err
    }
  }
}
