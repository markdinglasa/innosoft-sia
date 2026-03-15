export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  userId: number
  userName: string
}

export interface LoginResponse {
  user: any
  tokens: AuthTokens
  permissions: any[]
}
