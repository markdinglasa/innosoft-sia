import { AuthIpcChannel, IpcChannel } from "@shared/types"
import { AuthUser, LoginResponse } from "../types"

/**
 * Simulates or calls the actual IPC/API for login.
 * In this Electron setup, we might be calling a main process handler via IPC.
 */
interface LoginProps {
    username: string
    password: string
}
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
