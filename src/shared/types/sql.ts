export interface SqlApi {
  get(channel: string, ...args: any): any
  post(channel: string, ...args: any): any
  remove(channel: string, ...args: any): any
  update(channel: string, ...args: any): any
}

export enum SqlChannel {
  getAllAccounts = 'get-all-accounts',
  getKey = 'get-key',
  isConnected = 'validate-database-connection',
  login = 'log-in-user',
  logout = 'log-out-user',
  accessToken = 'access-token'
}
