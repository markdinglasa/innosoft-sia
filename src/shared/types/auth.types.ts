export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  userId: number
  username: string
}

export interface LoginResponse {
  user: any
  tokens: AuthTokens
  permissions: any[]
}
