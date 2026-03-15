import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { DiscountItemService } from '../../services/masterfile.services'

const discountItemService = new DiscountItemService()

registerProtectedIpcHandler(MasterfileIpcChannel.DISCOUNT_ITEM_LIST, async (_event, options) => await discountItemService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.DISCOUNT_ITEM_GET, async (_event, id) => await discountItemService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.DISCOUNT_ITEM_CREATE, async (_event, { payload, userId }) => await discountItemService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.DISCOUNT_ITEM_UPDATE, async (_event, { id, payload, userId }) => await discountItemService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.DISCOUNT_ITEM_DELETE, async (_event, { id, userId }) => await discountItemService.delete(id, userId))
