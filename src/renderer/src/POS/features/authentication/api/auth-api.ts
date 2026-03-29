import { AuthIpcChannel, IpcChannel } from "@shared/types"
import { AuthUser, LoginProps, LoginResponse } from "../types"

export const login = async (credentials: LoginProps): Promise<LoginResponse> => {
  try {
    const response = await window.electron.ipc.invoke(AuthIpcChannel.LOGIN, credentials)

    if (!response.success) {
      throw {
        message: response.error?.message || response.message || 'Sorry, Something went wrong.',
        error: response.error,
        metadata: response.metadata,
        statusCode: response.statusCode || 403
      }
    }
    
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const logout = async (): Promise<void> => {
  await window.electron.ipc.invoke(IpcChannel.logout)
}

export const verifySession = async (): Promise<AuthUser | null> => {
  const response = await window.electron.ipc.invoke(IpcChannel.verifySession)
  return response.success ? response.data.user : null
}
