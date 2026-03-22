import { DBConfig, SqlChannel } from '@shared/types'
import { safeStorage } from 'electron'
import Store from 'electron-store'
import sql from 'mssql'
import { v4 as uuidv4 } from 'uuid'
import { AppDataSource } from '../typeORM/configurations'

class DatabaseService {
  private store: Store
  private readonly STORE_KEY = 'database-connections'

  constructor() {
    this.store = new Store()
  }

  private encrypt(text: string): string {
    if (!safeStorage.isEncryptionAvailable()) {
      return text 
    }
    return safeStorage.encryptString(text).toString('base64')
  }

  private decrypt(encryptedText: string): string {
    if (!safeStorage.isEncryptionAvailable()) {
      return encryptedText
    }
    try {
      return safeStorage.decryptString(Buffer.from(encryptedText, 'base64'))
    } catch (error) {
       console.error('Decryption failed:', error)
       return ''
    }
  }

  async testConnection(config: DBConfig): Promise<{ success: boolean; message: string }> {
    let pool: sql.ConnectionPool | null = null
    try {
      const sqlConfig: sql.config = {
        server: config.server,
        port: config.port,
        database: config.name,
        user: config.user,
        password: config.password,
        options: {
          encrypt: true,
          trustServerCertificate: true,
          connectTimeout: 5000
        }
      }
      pool = await new sql.ConnectionPool(sqlConfig).connect()
      await pool.query('SELECT 1')
      return { success: true, message: 'Connection successful' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Connection failed' }
    } finally {
      if (pool) await pool.close()
    }
  }

  getConnections(): DBConfig[] {
    const connections = this.store.get(this.STORE_KEY, []) as DBConfig[]
    return connections.map(conn => ({
      ...conn,
      password: '*****'
    }))
  }

  async saveConnection(config: DBConfig): Promise<{ success: boolean; message: string }> {
    const connections = this.store.get(this.STORE_KEY, []) as DBConfig[]
    
    const encryptedConfig = {
      ...config,
      id: config.id || uuidv4(),
      user: this.encrypt(config.user),
      password: this.encrypt(config.password)
    }

    const index = connections.findIndex(c => c.id === encryptedConfig.id)
    if (index > -1) {
      connections[index] = encryptedConfig
    } else {
      connections.push(encryptedConfig)
    }

    this.store.set(this.STORE_KEY, connections)
    return { success: true, message: 'Connection saved' }
  }

  async activateConnection(id: string): Promise<{ success: boolean; message: string }> {
    const connections = this.store.get(this.STORE_KEY, []) as DBConfig[]
    const conn = connections.find(c => c.id === id)
    
    if (!conn) return { success: false, message: 'Connection not found' }

    try {
      const decryptedUser = this.decrypt(conn.user)
      const decryptedPassword = this.decrypt(conn.password)

      // 1. Test the connection first before making it active
      const testResult = await this.testConnection({
        ...conn,
        user: decryptedUser,
        password: decryptedPassword
      })

      if (!testResult.success) {
        return { success: false, message: `Activation failed: ${testResult.message}` }
      }

      // 2. If test succeeds, update legacy store key
      const legacyConfig: DBConfig = {
        ...conn,
        user: decryptedUser,
        password: decryptedPassword,
        isActive: true
      }
      this.store.set(SqlChannel.dbConfig, legacyConfig)

      // 3. Update isActive status in the multi-tenant store
      const updatedConnections = connections.map(c => ({
        ...c,
        isActive: c.id === id
      }))
      this.store.set(this.STORE_KEY, updatedConnections)

      // 4. Re-initialize TypeORM
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy()
      }

      Object.assign(AppDataSource.options, {
        host: conn.server,
        port: conn.port,
        username: decryptedUser,
        password: decryptedPassword,
        database: conn.name
      })

      await AppDataSource.initialize()
      await AppDataSource.synchronize()

      return { success: true, message: 'Connection activated successfully' }
    } catch (error: any) {
      console.error('Failed to activate connection:', error)
      return { success: false, message: error.message || 'An unexpected error occurred during activation' }
    }
  }

  async syncSchema(): Promise<{ success: boolean; message: string }> {
    try {
      if (!AppDataSource.isInitialized) {
        // Try to initialize if not done yet
        const activeConfig = await this.getActiveConfig()
        if (!activeConfig) return { success: false, message: 'No active connection to sync' }
        
        Object.assign(AppDataSource.options, {
          host: activeConfig.server,
          port: activeConfig.port,
          username: activeConfig.user,
          password: activeConfig.password,
          database: activeConfig.name
        })
        await AppDataSource.initialize()
      }
      
      await AppDataSource.synchronize()
      return { success: true, message: 'Database schema synchronized successfully' }
    } catch (error: any) {
      console.error('Schema sync failed:', error)
      return { success: false, message: error.message || 'Failed to synchronize database schema' }
    }
  }

  async deleteConnection(id: string): Promise<{ success: boolean; message: string }> {
    const connections = this.store.get(this.STORE_KEY, []) as DBConfig[]
    const updatedConnections = connections.filter(c => c.id !== id)
    this.store.set(this.STORE_KEY, updatedConnections)
    return { success: true, message: 'Connection deleted' }
  }

  async getActiveConfig(): Promise<DBConfig | null> {
    const connections = this.store.get(this.STORE_KEY, []) as DBConfig[]
    const active = connections.find(c => c.isActive)
    if (!active) {
      // Fallback to legacy key if no active found in multi-tenant store
      const legacy = this.store.get(SqlChannel.dbConfig) as DBConfig | null
      if (legacy) return legacy
      return null
    }
    
    return {
      ...active,
      user: this.decrypt(active.user),
      password: this.decrypt(active.password)
    }
  }
}

export const databaseService = new DatabaseService()
