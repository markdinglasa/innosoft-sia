import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { ItemPriceService } from '../../services/masterfile.services'

const itemPriceService = new ItemPriceService()

registerIpcHandler(MasterfileIpcChannel.ITEM_PRICE_LIST, async (_event, options) => await itemPriceService.list(options))
registerIpcHandler(MasterfileIpcChannel.ITEM_PRICE_GET, async (_event, id) => await itemPriceService.get(id))
registerIpcHandler(MasterfileIpcChannel.ITEM_PRICE_CREATE, async (_event, { payload, userId }) => await itemPriceService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.ITEM_PRICE_UPDATE, async (_event, { id, payload, userId }) => await itemPriceService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.ITEM_PRICE_DELETE, async (_event, { id, userId }) => await itemPriceService.delete(id, userId))
