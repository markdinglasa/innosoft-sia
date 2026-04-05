import { MstBranchEntity, MstTerminalEntity, MstUserEntity } from '../../main/entities'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  userId: number
  username: string
  fingerprint?: string
  loginDate: string
}

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
  user: MstUserEntity
  tokens: AuthTokens
  permissions: any[]
  branches: MstBranchEntity[]
  loginDate: string
  terminal?: MstTerminalEntity
}

