// return current user and its permissions

import { BadRequestException } from "../../common/exceptions"
import { registerProtectedIpcHandler } from "../../common/utils/ipc-handler"
import { AuthService } from "../../services/auth.services"

const authService = new AuthService()
registerProtectedIpcHandler('auth:get-current-user', async (_event, userId: number) => {
  if (!userId) {
    throw new BadRequestException('User ID is required to fetch current user')
  }

  const user = await authService.currentUser(userId)
  return user
})
