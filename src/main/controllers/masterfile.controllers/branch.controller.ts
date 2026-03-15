import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { BranchService } from '../../services/masterfile.services'

const branchService = new BranchService()

registerProtectedIpcHandler(MasterfileIpcChannel.BRANCH_LIST, async (_event, options) => await branchService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.BRANCH_GET, async (_event, id) => await branchService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.BRANCH_CREATE, async (_event, { payload, userId }) => await branchService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.BRANCH_UPDATE, async (_event, { id, payload, userId }) => await branchService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.BRANCH_DELETE, async (_event, { id, userId }) => await branchService.delete(id, userId))
