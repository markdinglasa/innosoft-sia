import { UtilityIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { SysStorageService } from '../../services/utility.services'

const sysStorageService = new SysStorageService()

// Storage IPC
registerProtectedIpcHandler(UtilityIpcChannel.STORAGE_UPLOAD, async (_event, { file, payload }) => {
  // Assuming file is passed as a Buffer from the renderer/preload
  return await sysStorageService.uploadFile(file, payload)
})

registerProtectedIpcHandler(UtilityIpcChannel.STORAGE_DELETE, async (_event, key) => {
  return await sysStorageService.deleteFile(key)
})

registerProtectedIpcHandler(UtilityIpcChannel.STORAGE_GET_URL, async (_event, key) => {
  return await sysStorageService.getFileUrl(key)
})

registerProtectedIpcHandler(UtilityIpcChannel.STORAGE_GET_SIGNED_URL, async (_event, { key, expiresIn }) => {
  return await sysStorageService.getSignedUrl(key, expiresIn)
})

registerProtectedIpcHandler(UtilityIpcChannel.STORAGE_GET_SIGNED_DOWNLOAD_URL, async (_event, { key, fileName, expiresIn }) => {
  return await sysStorageService.getSignedDownloadUrl(key, fileName, expiresIn)
})
