import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { DiscountService } from '../../services/masterfile.services'

const discountService = new DiscountService()

registerProtectedIpcHandler(MasterfileIpcChannel.DISCOUNT_LIST, async (_event, options) => await discountService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.DISCOUNT_GET, async (_event, id) => await discountService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.DISCOUNT_CREATE, async (_event, { payload, userId }) => await discountService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.DISCOUNT_UPDATE, async (_event, { id, payload, userId }) => await discountService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.DISCOUNT_DELETE, async (_event, { id, userId }) => await discountService.delete(id, userId))
