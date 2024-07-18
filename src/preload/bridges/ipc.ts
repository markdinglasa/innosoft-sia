import { ipcRenderer } from 'electron'

import { IpcApi, IpcChannel } from '../../shared/types'
import { getFailChannel, getSuccessChannel } from '../../shared/utils/ipc'

const baseValidChannels = [
  IpcChannel.clearStore,
  IpcChannel.exportStore,
  IpcChannel.importStore,
  IpcChannel.loadStore,
  IpcChannel.restartApp,
  IpcChannel.setStoreValue,
  IpcChannel.closeApp,
]

const failValidChannels = baseValidChannels.map(getFailChannel)
const successValidChannels = baseValidChannels.map(getSuccessChannel)
const validChannels = [...baseValidChannels, ...failValidChannels, ...successValidChannels]

const on = (channel: string, func: any) => {
  if (validChannels.includes(channel)) {
    ipcRenderer.on(channel, (_, ...args) => func(...args))
  }
}

const removeListener = (channel: string, func: any) => {
  if (validChannels.includes(channel)) {
    ipcRenderer.removeListener(channel, (_, ...args) => func(...args))
  }
}

const send = (channel: string, payload: any) => {
    ipcRenderer.send(channel, payload)
}

export const ipcApi: IpcApi = {
  on,
  removeListener,
  send
}
