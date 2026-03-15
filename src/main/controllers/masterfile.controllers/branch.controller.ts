import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { BranchService } from '../../services/masterfile.services'

const branchService = new BranchService()

registerIpcHandler(MasterfileIpcChannel.BRANCH_LIST, async (_event, options) => await branchService.list(options))
registerIpcHandler(MasterfileIpcChannel.BRANCH_GET, async (_event, id) => await branchService.get(id))
registerIpcHandler(MasterfileIpcChannel.BRANCH_CREATE, async (_event, { payload, userId }) => await branchService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.BRANCH_UPDATE, async (_event, { id, payload, userId }) => await branchService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.BRANCH_DELETE, async (_event, { id, userId }) => await branchService.delete(id, userId))
