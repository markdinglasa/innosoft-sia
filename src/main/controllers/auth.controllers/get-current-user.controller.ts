// return current user and its permissions

import { AuthIpcChannel } from "@shared/types"
import { BadRequestException } from "../../common/exceptions"
import { registerProtectedIpcHandler } from "../../common/utils/ipc-handler"
import { AuthService } from "../../services/auth.services"

const authService = new AuthService()
registerProtectedIpcHandler(AuthIpcChannel.GET_CURRENT_USER, async (_event, userId: number) => {
  if (!userId) {
    throw new BadRequestException('User ID is required to fetch current user')
  }

  const user = await authService.currentUser(userId)
  return user
})
