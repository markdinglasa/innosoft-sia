import { MstUserEntity } from "src/main/entities"

export interface AuthUser extends MstUserEntity {}

export interface LoginProps {
  username: string
  password: string
  loginDate?: string
  override?: {
    username: string
    password: string
  }
}

export interface LoginResponse {
  user: AuthUser
  tokens: {
    accessToken: string
    refreshToken: string
  }
  permissions: string[]
  loginDate: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
