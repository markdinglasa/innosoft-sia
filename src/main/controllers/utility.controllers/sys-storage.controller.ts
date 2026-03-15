import { UtilityIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { SysStorageService } from '../../services/utility.services'

const sysStorageService = new SysStorageService()

// Storage IPC
registerIpcHandler(UtilityIpcChannel.STORAGE_UPLOAD, async (_event, { file, payload }) => {
  // Assuming file is passed as a Buffer from the renderer/preload
  return await sysStorageService.uploadFile(file, payload)
})

registerIpcHandler(UtilityIpcChannel.STORAGE_DELETE, async (_event, key) => {
  return await sysStorageService.deleteFile(key)
})

registerIpcHandler(UtilityIpcChannel.STORAGE_GET_URL, async (_event, key) => {
  return await sysStorageService.getFileUrl(key)
})

registerIpcHandler(UtilityIpcChannel.STORAGE_GET_SIGNED_URL, async (_event, { key, expiresIn }) => {
  return await sysStorageService.getSignedUrl(key, expiresIn)
})

registerIpcHandler(UtilityIpcChannel.STORAGE_GET_SIGNED_DOWNLOAD_URL, async (_event, { key, fileName, expiresIn }) => {
  return await sysStorageService.getSignedDownloadUrl(key, fileName, expiresIn)
})
