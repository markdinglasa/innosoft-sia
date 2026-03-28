import { AuthIpcChannel, IpcChannel } from "@shared/types"
import { AuthUser, LoginProps, LoginResponse } from "../types"

export const login = async (credentials: LoginProps): Promise<LoginResponse> => {
  try {
    const response = await window.electron.ipc.invoke(AuthIpcChannel.LOGIN, credentials)
    console.log('response:', response)
    if (!response.success) {
      throw new Error(response.message || 'Login failed')
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
