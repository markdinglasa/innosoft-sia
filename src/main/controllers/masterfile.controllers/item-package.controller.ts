import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { ItemPackageService } from '../../services/masterfile.services'

const itemPackageService = new ItemPackageService()

registerIpcHandler(MasterfileIpcChannel.ITEM_PACKAGE_LIST, async (_event, options) => await itemPackageService.list(options))
registerIpcHandler(MasterfileIpcChannel.ITEM_PACKAGE_GET, async (_event, id) => await itemPackageService.get(id))
registerIpcHandler(MasterfileIpcChannel.ITEM_PACKAGE_CREATE, async (_event, { payload, userId }) => await itemPackageService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.ITEM_PACKAGE_UPDATE, async (_event, { id, payload, userId }) => await itemPackageService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.ITEM_PACKAGE_DELETE, async (_event, { id, userId }) => await itemPackageService.delete(id, userId))
