import { DataSource } from 'typeorm'
import * as Entities from '../entities'
import { getConnection } from '../functions/configuration'
import { detectDbCapabilities } from './db-capabilities'

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost', // default settings
  port: 1433, // default settings
  username: 'sa', // default settings
  password: 'innosoft', // default settings
  database: 'pos13', // default settings
  synchronize: false,
  logging: false,
  entities: Object.values(Entities).filter((entity) => typeof entity === 'function'),
  subscribers: [],
  migrations: [],
  extra: {
    trustServerCertificate: true,
    encrypt: true
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1'
    }
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
      port: Number.parseInt(port || '1433', 10),
      username: user,
      password: password,
      database: name
    })

    try {
      await AppDataSource.initialize()
      console.log('Data Source has been initialized!')
      await detectDbCapabilities()
    } catch (err) {
      console.error('Error during Data Source initialization', err)
      throw err
    }
  }
}

export const reinitializeDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
    await initializeDatabase()
  } catch (err) {
    console.error('Failed to reinitialize database:', err)
    throw err
  }
}
