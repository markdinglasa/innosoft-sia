import { PayloadAction } from '@reduxjs/toolkit'
import { IpcChannel } from '../types/'

export const clearStore = () => {
  window.electron.ipc.send(IpcChannel.clearStore)
}

export const restartApp = () => {
  window.electron.ipc.send(IpcChannel.restartApp)
}

export const closeApp = () => {
  window.electron.ipc.send(IpcChannel.closeApp)
}

export function setLocalAndStateReducer<T>(sliceName: string) {
  return (_: unknown, action: PayloadAction<T>) => {
    window.electron.ipc.send(IpcChannel.setStoreValue, { key: sliceName, state: action.payload })
    return action.payload
  }
}

export const getFailChannel = (channel: IpcChannel) => `${channel}-fail`

export const getSuccessChannel = (channel: IpcChannel) => `${channel}-success`
