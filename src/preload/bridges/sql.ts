import { ipcRenderer } from 'electron'
import { SqlApi } from '../../shared/types/sql'

export const sqlApi: SqlApi = {
  get: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  post: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  delete: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  update: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args)
}
