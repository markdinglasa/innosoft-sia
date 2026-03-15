import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { AccountService } from '../../services/masterfile.services'

const accountService = new AccountService()

registerProtectedIpcHandler(MasterfileIpcChannel.ACCOUNT_LIST, async (_event, options) => await accountService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.ACCOUNT_GET, async (_event, id) => await accountService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.ACCOUNT_CREATE, async (_event, { payload, userId }) => await accountService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ACCOUNT_UPDATE, async (_event, { id, payload, userId }) => await accountService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ACCOUNT_DELETE, async (_event, { id, userId }) => await accountService.delete(id, userId))
