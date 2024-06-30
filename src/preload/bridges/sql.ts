import { ipcRenderer } from 'electron'
import { SqlApi } from '../../shared/types/sql'

/*
const baseValidChannels: Array<string> = [SqlChannel.getAllAccounts]

const get = (channel: string, ...args: any) => {
  if (baseValidChannels.includes(channel)) {
    ipcRenderer.invoke(channel, ...args)
  }
}

const post = (channel: string, ...args: any) => {
  if (baseValidChannels.includes(channel)) {
    ipcRenderer.invoke(channel, ...args)
  }
}
const remove = (channel: string, ...args: any) => {
  if (baseValidChannels.includes(channel)) {
    ipcRenderer.invoke(channel, ...args)
  }
}
const update = (channel: string, ...args: any) => {
  if (baseValidChannels.includes(channel)) {
    ipcRenderer.invoke(channel, ...args)
  }
}*/

export const sqlApi: SqlApi = {
  get: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  post: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  remove: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  update: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args)
}
