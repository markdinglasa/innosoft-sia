import { DataSource } from 'typeorm'
import { getConnection } from '../functions/configuration'
import { MstBranchEntity } from '../entities/masterfiles/MstBranch.entity'
import { TrnSalesEntity } from '../entities/transactions/TrnSales.entity'
import { SysSalesLockedEntity } from '../entities/utilities/SysSalesLocked.entity'

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: getConnection().Data?.server || '',
  port: parseInt(getConnection().Data?.port || '1433', 10),
  username: getConnection().Data?.user || '',
  password: getConnection().Data?.password || '',
  database: getConnection().Data?.name || '',
  synchronize: false,
  logging: true,
  entities: [MstBranchEntity, TrnSalesEntity, SysSalesLockedEntity],
  subscribers: [],
  migrations: [],
  extra: {
    trustServerCertificate: true,
    encrypt: false
  }
})

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize()
      console.log('Data Source has been initialized!')
    } catch (err) {
      console.error('Error during Data Source initialization', err)
      throw err
    }
  }
}
