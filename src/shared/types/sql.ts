export interface SqlApi {
  get(channel: string, ...args: any): any
  post(channel: string, ...args: any): any
  remove(channel: string, ...args: any): any
  update(channel: string, ...args: any): any
}

export enum SqlChannel {
  getKey = 'get-key',
  isLicense = 'is-license-valid',
  accessToken = 'access-token',
  login = 'log-in-user',
  logout = 'log-out-user',
  isConnected = 'validate-database-connection',
  dbConfig = 'database-configuration',
  setConnection = 'set-database-connection',
  getConnection = 'get-database-connection',
  getAllAccounts = 'get-all-accounts',
}
