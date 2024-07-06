import { Auth, Database, License, MstAccount, MstUser } from './sqlChannels'

export interface SqlApi {
  get(channel: string, ...args: any): any
  post(channel: string, ...args: any): any
  remove(channel: string, ...args: any): any
  update(channel: string, ...args: any): any
}

export const SqlChannel = {
  ...License,
  ...Auth,
  ...Database,
  ...MstAccount,
  ...MstUser,
} as const

export type SqlChannelType = (typeof SqlChannel)[keyof typeof SqlChannel]
