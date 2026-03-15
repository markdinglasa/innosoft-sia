import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { BranchAccessService } from '../../services/masterfile.services'

const branchAccessService = new BranchAccessService()

registerProtectedIpcHandler(MasterfileIpcChannel.BRANCH_ACCESS_LIST, async (_event, options) => await branchAccessService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.BRANCH_ACCESS_GET, async (_event, id) => await branchAccessService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.BRANCH_ACCESS_CREATE, async (_event, { payload, userId }) => await branchAccessService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.BRANCH_ACCESS_UPDATE, async (_event, { id, payload, userId }) => await branchAccessService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.BRANCH_ACCESS_DELETE, async (_event, { id, userId }) => await branchAccessService.delete(id, userId))
