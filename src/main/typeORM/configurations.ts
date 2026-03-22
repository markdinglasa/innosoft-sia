import { DataSource } from 'typeorm'
import * as Entities from '../entities'
import { databaseService } from '../services/database.service'

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost', // default settings
  port: 1433, // default settings
  username: 'sa', // default settings
  password: '', // default settings
  database: '', // default settings
  synchronize: true,
  logging: false,
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
    const activeConfig = await databaseService.getActiveConfig()
    if (!activeConfig) {
      console.warn('No active database connection configured.')
      return
    }

    const { server, port, user, password, name } = activeConfig

    Object.assign(AppDataSource.options, {
      host: server,
      port: port,
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
