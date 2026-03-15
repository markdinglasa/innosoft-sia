import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { ItemPackageService } from '../../services/masterfile.services'

const itemPackageService = new ItemPackageService()

registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_PACKAGE_LIST, async (_event, options) => await itemPackageService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_PACKAGE_GET, async (_event, id) => await itemPackageService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_PACKAGE_CREATE, async (_event, { payload, userId }) => await itemPackageService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_PACKAGE_UPDATE, async (_event, { id, payload, userId }) => await itemPackageService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_PACKAGE_DELETE, async (_event, { id, userId }) => await itemPackageService.delete(id, userId))
