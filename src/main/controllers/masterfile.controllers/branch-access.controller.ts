import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { BranchAccessService } from '../../services/masterfile.services'

const branchAccessService = new BranchAccessService()

registerIpcHandler(MasterfileIpcChannel.BRANCH_ACCESS_LIST, async (_event, options) => await branchAccessService.list(options))
registerIpcHandler(MasterfileIpcChannel.BRANCH_ACCESS_GET, async (_event, id) => await branchAccessService.get(id))
registerIpcHandler(MasterfileIpcChannel.BRANCH_ACCESS_CREATE, async (_event, { payload, userId }) => await branchAccessService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.BRANCH_ACCESS_UPDATE, async (_event, { id, payload, userId }) => await branchAccessService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.BRANCH_ACCESS_DELETE, async (_event, { id, userId }) => await branchAccessService.delete(id, userId))
