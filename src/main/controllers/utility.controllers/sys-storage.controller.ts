import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { SysStorageService } from '../../services/utility.services'

const sysStorageService = new SysStorageService()

// Storage IPC
registerIpcHandler('utility:storage:upload', async (_event, { file, payload }) => {
  // Assuming file is passed as a Buffer from the renderer/preload
  return await sysStorageService.uploadFile(file, payload)
})

registerIpcHandler('utility:storage:delete', async (_event, key) => {
  return await sysStorageService.deleteFile(key)
})

registerIpcHandler('utility:storage:getUrl', async (_event, key) => {
  return await sysStorageService.getFileUrl(key)
})

registerIpcHandler('utility:storage:getSignedUrl', async (_event, { key, expiresIn }) => {
  return await sysStorageService.getSignedUrl(key, expiresIn)
})

registerIpcHandler('utility:storage:getSignedDownloadUrl', async (_event, { key, fileName, expiresIn }) => {
  return await sysStorageService.getSignedDownloadUrl(key, fileName, expiresIn)
})
