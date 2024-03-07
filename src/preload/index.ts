import { contextBridge, ipcRenderer } from 'electron';

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

export const WINDOW_ACTION= {
  send: (channel: string, ...args: any) => ipcRenderer.send(channel, ...args),
}
export const WINDOW_API= {
  get: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  post: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  delete: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  update: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
}
//

try {
  contextBridge.exposeInMainWorld('action', WINDOW_ACTION );
  contextBridge.exposeInMainWorld('api', WINDOW_API );
} catch (error) {
  console.error(error)
}
