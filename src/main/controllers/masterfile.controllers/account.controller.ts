import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { AccountService } from '../../services/masterfile.services'

const accountService = new AccountService()

registerIpcHandler(MasterfileIpcChannel.ACCOUNT_LIST, async (_event, options) => await accountService.list(options))
registerIpcHandler(MasterfileIpcChannel.ACCOUNT_GET, async (_event, id) => await accountService.get(id))
registerIpcHandler(MasterfileIpcChannel.ACCOUNT_CREATE, async (_event, { payload, userId }) => await accountService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.ACCOUNT_UPDATE, async (_event, { id, payload, userId }) => await accountService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.ACCOUNT_DELETE, async (_event, { id, userId }) => await accountService.delete(id, userId))
