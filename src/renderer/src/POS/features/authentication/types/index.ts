import { MstUserEntity } from "src/main/entities"

export interface AuthUser extends MstUserEntity {}

export interface LoginResponse {
  user: AuthUser
  token: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
