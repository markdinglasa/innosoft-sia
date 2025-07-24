import {
  Alliance,
  Auth,
  Database,
  GENERIC_REPORT,
  License,
  MEGAWORLD,
  MstAccount,
  MstUser,
  RLC,
  SIA
} from './sqlChannels'

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
  ...SIA,
  ...MstAccount,
  ...MstUser,
  ...MEGAWORLD,
  ...Alliance,
  ...RLC,
  ...GENERIC_REPORT
} as const

export type SqlChannelType = (typeof SqlChannel)[keyof typeof SqlChannel]
