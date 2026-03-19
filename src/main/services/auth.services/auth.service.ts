import { SYSTEM_ACCESS_TOKEN, SYSTEM_REFRESH_TOKEN, SYSTEM_SELF } from '@shared/constants'
import { LoginResponse, TokenPayload } from '@shared/types/auth.types'
import * as bcrypt from 'bcrypt'
import { FindOneOptions } from 'typeorm'
import { UnauthorizedException } from '../../common/exceptions'
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../common/utils/jwt.util'
import { MstPermissionsEntity } from '../../entities/masterfiles'
import { MstUserEntity } from '../../entities/masterfiles/MstUser.entity'
import Store from '../../store/Store'
import { AppDataSource } from '../../typeORM/configurations'
import { BaseService, IBaseService } from '../base.service'

/**
 * Interface defining the Authentication and Authorization service.
 */
export interface IAuthService extends IBaseService<MstUserEntity> {
  login(userName: string, password: string): Promise<LoginResponse>
  logout(): Promise<void>
  refreshTokens(): Promise<LoginResponse>
  validateAccessToken(): Promise<TokenPayload>
  getPermissions(userId: number): Promise<MstPermissionsEntity[]>
  changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean>
  currentUser(userId: number): Promise<MstUserEntity | null>
}

/**
 * Service class handling user authentication and permissions.
 */
export class AuthService extends BaseService<MstUserEntity> implements IAuthService {
  constructor() {
    super(MstUserEntity)
  }

  /**
   * Verifies credentials using bcrypt, generates JWT tokens, and stores them.
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    // Find user by username only (not by password)
    const options: FindOneOptions<MstUserEntity> = {
      where: {
        username,
        isLocked: false
      }
    }
    const user = await this.repository.findOne(options)

    if (!user) {
      throw new UnauthorizedException('Invalid username or password')
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password')
    }

    // Generate tokens
    const tokenPayload: TokenPayload = { userId: user.id, username: user.username }
    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Store tokens and user in electron-store
    Store.set(SYSTEM_ACCESS_TOKEN, accessToken)
    Store.set(SYSTEM_REFRESH_TOKEN, refreshToken)
    Store.set(SYSTEM_SELF, user)

    // Get permissions
    const permissions = await this.getPermissions(user.id)

    // Return user without password
    const { password: _pwd, ...safeUser } = user

    return {
      user: safeUser,
      tokens: { accessToken, refreshToken },
      permissions
    }
  }

  /**
   * Clears tokens and user session from electron-store.
   */
  async logout(): Promise<void> {
    Store.set(SYSTEM_ACCESS_TOKEN, undefined as any)
    Store.set(SYSTEM_REFRESH_TOKEN, undefined as any)
    Store.set(SYSTEM_SELF, undefined as any)
  }

  /**
   * Verifies the stored refresh token and generates a new token pair.
   */
  async refreshTokens(): Promise<LoginResponse> {
    const refreshToken = Store.get(SYSTEM_REFRESH_TOKEN)

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found. Please log in again.')
    }

    let decoded: TokenPayload
    try {
      decoded = verifyToken(refreshToken)
    } catch {
      // Clear invalid tokens
      await this.logout()
      throw new UnauthorizedException('Refresh token expired. Please log in again.')
    }

    // Re-fetch the user to make sure they still exist and aren't locked
    const user = await this.repository.findOneBy({ id: decoded.userId } as any)
    if (!user) {
      await this.logout()
      throw new UnauthorizedException('User no longer exists.')
    }

    // Generate new tokens
    const tokenPayload: TokenPayload = { userId: user.id, username: user.username }
    const newAccessToken = generateAccessToken(tokenPayload)
    const newRefreshToken = generateRefreshToken(tokenPayload)

    // Update store
    Store.set(SYSTEM_ACCESS_TOKEN, newAccessToken)
    Store.set(SYSTEM_REFRESH_TOKEN, newRefreshToken)
    Store.set(SYSTEM_SELF, user)

    const permissions = await this.getPermissions(user.id)
    const { password: _pwd, ...safeUser } = user

    return {
      user: safeUser,
      tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      permissions
    }
  }

  /**
   * Validates the stored access token (auth guard).
   * Returns the decoded payload if valid, throws otherwise.
   */
  async validateAccessToken(): Promise<TokenPayload> {
    const accessToken = Store.get(SYSTEM_ACCESS_TOKEN)

    if (!accessToken) {
      throw new UnauthorizedException('No access token found. Please log in.')
    }

    try {
      return verifyToken(accessToken)
    } catch {
      throw new UnauthorizedException('Access token expired or invalid.')
    }
  }

  /**
   * Fetches the permissions (forms) allowed for a specific user.
   */
  async getPermissions(userId: number): Promise<MstPermissionsEntity[]> {
    return await AppDataSource.getRepository(MstPermissionsEntity).find({
      where: { role: { userRoles: { user: { id: userId } } } },
    })
  }

  /**
   * Updates the user's password after verifying the old one with bcrypt.
   */
  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.get(userId)
    if (!user) {
      return false
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if (!isOldPasswordValid) {
      return false
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await this.update(userId, { password: hashedNewPassword } as any)
    return true
  }

  /**
   * Fetches the current user and its permissions.
   */
  async currentUser(userId: number): Promise<MstUserEntity | null> {
    const user = await this.get(userId)
    if (!user) throw new Error('User not found')

    const permissions = await this.getPermissions(userId)
    user.permissions = permissions || []

    return user
  }
}
