import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { DiscountItemService } from '../../services/masterfile.services'

const discountItemService = new DiscountItemService()

registerIpcHandler(MasterfileIpcChannel.DISCOUNT_ITEM_LIST, async (_event, options) => await discountItemService.list(options))
registerIpcHandler(MasterfileIpcChannel.DISCOUNT_ITEM_GET, async (_event, id) => await discountItemService.get(id))
registerIpcHandler(MasterfileIpcChannel.DISCOUNT_ITEM_CREATE, async (_event, { payload, userId }) => await discountItemService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.DISCOUNT_ITEM_UPDATE, async (_event, { id, payload, userId }) => await discountItemService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.DISCOUNT_ITEM_DELETE, async (_event, { id, userId }) => await discountItemService.delete(id, userId))
