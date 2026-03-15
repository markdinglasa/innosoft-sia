import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { DiscountService } from '../../services/masterfile.services'

const discountService = new DiscountService()

registerIpcHandler(MasterfileIpcChannel.DISCOUNT_LIST, async (_event, options) => await discountService.list(options))
registerIpcHandler(MasterfileIpcChannel.DISCOUNT_GET, async (_event, id) => await discountService.get(id))
registerIpcHandler(MasterfileIpcChannel.DISCOUNT_CREATE, async (_event, { payload, userId }) => await discountService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.DISCOUNT_UPDATE, async (_event, { id, payload, userId }) => await discountService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.DISCOUNT_DELETE, async (_event, { id, userId }) => await discountService.delete(id, userId))
