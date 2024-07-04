import { SqlApi } from '@shared/types'
import { ipcRenderer } from 'electron'

export const sqlApi: SqlApi = {
  get: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  post: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  remove: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  update: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args)
}
