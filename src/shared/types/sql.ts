export interface SqlApi {
  get(channel: string, ...args: any): any
  post(channel: string, ...args: any): any
  delete(channel: string, ...args: any): any
  update(channel: string, ...args: any): any
}
