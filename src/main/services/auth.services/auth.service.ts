import { POS_MANAGER, SYSTEM_ACCESS_TOKEN, SYSTEM_LOGIN_DATE, SYSTEM_REFRESH_TOKEN, SYSTEM_SELF } from '@shared/constants'
import { LoginResponse, TokenPayload } from '@shared/types/auth.types'
import * as bcrypt from 'bcrypt'
import { FindOneOptions } from 'typeorm'
import { ClosedDateException, UnauthorizedException } from '../../common/exceptions'
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../common/utils/jwt.util'
import { MstPermissionsEntity, MstUserEntity } from '../../entities/masterfiles'
import Store from '../../store/Store'
import { AppDataSource } from '../../typeORM/configurations'
import { BaseService, IBaseService } from '../base.service'
import { FingerprintService } from '../licensing/fingerprint.service'
import { TrnCollectionEntity } from '../../entities/transactions'
import { SysAuditTrailService } from '../utility.services/sys-audit-trail.service/sys-audit-trail.service'

/**
 * Interface defining the Authentication and Authorization service.
 */
export interface IAuthService extends IBaseService<MstUserEntity> {
  login(username: string, password: string, loginDate?: string, override?: any): Promise<LoginResponse>
  logout(): Promise<void>
  refreshTokens(): Promise<LoginResponse>
  validateAccessToken(): Promise<TokenPayload>
  getPermissions(userId: number): Promise<string[]>
  changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean>
  currentUser(userId: number): Promise<MstUserEntity | null>
}

/**
 * Service class handling user authentication and permissions.
 */
export class AuthService extends BaseService<MstUserEntity> implements IAuthService {
  private auditService: SysAuditTrailService

  constructor() {
    super(MstUserEntity)
    this.auditService = new SysAuditTrailService()
  }

  /**
   * Verifies credentials using bcrypt, generates JWT tokens, and stores them.
   */
  async login(
    username: string,
    password: string,
    loginDateProps?: string,
    override?: any
  ): Promise<LoginResponse> {
    const loginDate = loginDateProps || new Date().toISOString()

    // 1. Brute-Force Shield: Check Lockout
    const lockoutKey = `auth_lockout_${username}` as any
    const lockUntil = Store.get(lockoutKey) as number | undefined
    if (lockUntil && lockUntil > Date.now()) {
      const remainingMinutes = Math.ceil((lockUntil - Date.now()) / (1000 * 60))
      throw new UnauthorizedException(
        `Account Temporarily Locked. Try again in ${remainingMinutes} minutes.`
      )
    }

    const genericError = 'Invalid username or password.'

    // 2. Find user by username
    const options: FindOneOptions<MstUserEntity> = {
      where: {
        username
      }
    }
    const user = await this.repository.findOne(options)

    if (!user) {
      await this.handleFailedAttempt(username)
      throw new UnauthorizedException(genericError)
    }

    // 3. Status Check: Reject if not Active
    if (user.status !== 'Active') {
      await this.handleFailedAttempt(username)
      throw new UnauthorizedException(genericError)
    }

    // 4. BCrypt Verification
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      await this.handleFailedAttempt(username)
      throw new UnauthorizedException(genericError)
    }

    // 5. Business Date Validation (FEAT-AUT-007)
    const isClosed = await this.checkIsDateClosed(loginDate)
    if (isClosed) {
      if (!override || !override.username || !override.password) {
        throw new ClosedDateException('The selected business date is already closed.', {
          requireOverride: true,
          selectedDate: loginDate
        })
      }

      const isOverrideValid = await this.verifyManagerOverride(override.username, override.password)
      if (!isOverrideValid) {
        await this.auditService.log({
          userId: user.id,
          tableInformation: 'MstUser',
          recordInformation: `Login on closed date: ${loginDate}`,
          actionInformation: `FAILED MANAGER OVERRIDE by ${override.username}`
        })
        throw new UnauthorizedException('Invalid Manager Credentials for date override.')
      }

      await this.auditService.log({
        userId: user.id,
        tableInformation: 'MstUser',
        recordInformation: `Login on closed date: ${loginDate}`,
        actionInformation: `MANAGER OVERRIDE SUCCESS by ${override.username}`
      })
    }

    // 6. Success! Reset Shield
    Store.set(`auth_failed_${username}` as any, 0)
    Store.set(lockoutKey, 0)

    // 7. Machine Fingerprinting
    const fingerprint = await FingerprintService.generateFingerprint()

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      username: user.username,
      fingerprint,
      loginDate
    }
    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Store tokens and user in electron-store
    Store.set(SYSTEM_ACCESS_TOKEN, accessToken)
    Store.set(SYSTEM_REFRESH_TOKEN, refreshToken)
    Store.set(SYSTEM_SELF, user)
    Store.set(SYSTEM_LOGIN_DATE, loginDate)

    const permissions = await this.getPermissions(user.id)

    // Sync POS store for next boot
    Store.set(POS_MANAGER, {
      initialize: true,
      activeUser: user,
      activePage: 'dashboard',
      activePermissions: permissions,
      loginDate
    })

    await this.auditService.log({
      userId: user.id,
      tableInformation: 'MstUser',
      recordInformation: `Login Successful - Machine: ${fingerprint.substring(0, 8)}...`,
      actionInformation: 'LOGIN',
      newData: { loginDate }
    })

    // Return user without password
    const { password: _pwd, ...safeUser } = user

    return {
      user: safeUser,
      tokens: { accessToken, refreshToken },
      permissions: permissions as any,
      loginDate
    }
  }

  /**
   * Checks if a date has any "Locked" collections.
   */
  private async checkIsDateClosed(dateStr: string): Promise<boolean> {
    const date = new Date(dateStr)
    const formattedDate = date.toISOString().split('T')[0]

    const closedCount = await AppDataSource.getRepository(TrnCollectionEntity)
      .createQueryBuilder('collection')
      .where('CAST(collection.collectionDate AS DATE) = :date', { date: formattedDate })
      .andWhere('collection.isLocked = :isLocked', { isLocked: true })
      .getCount()

    return closedCount > 0
  }

  /**
   * Verifies if the provided user has manager permissions.
   */
  private async verifyManagerOverride(username: string, password: string): Promise<boolean> {
    const user = await this.repository.findOne({
      where: { username },
      relations: ['userRoles', 'userRoles.role']
    })

    if (!user || user.status !== 'Active') return false

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return false

    // Check for Manager role or specific permission
    const isManager = user.userRoles?.some((ur) => ur.role?.name.toLowerCase().includes('manager'))
    return !!isManager
  }

  /**
   * Private helper to track and enforce failed login attempts.
   */
  private async handleFailedAttempt(username: string) {
    const failedKey = `auth_failed_${username}` as any
    const lockoutKey = `auth_lockout_${username}` as any
    
    const currentFailures = (Store.get(failedKey) as number || 0) + 1
    Store.set(failedKey, currentFailures)
    
    if (currentFailures >= 5) {
      const lockDuration = 15 * 60 * 1000 // 15 mins
      Store.set(lockoutKey, Date.now() + lockDuration)
    }
  }

  /**
   * Sessions are bound to machine fingerprint.
   */
  private async verifySessionIntegrity(payload: TokenPayload) {
    const currentFingerprint = await FingerprintService.generateFingerprint()
    if (payload.fingerprint && payload.fingerprint !== currentFingerprint) {
      throw new UnauthorizedException('Session Invalid: Machine mismatch.')
    }
  }

  /**
   * Clears tokens and user session from electron-store.
   */
  async logout(): Promise<void> {
    const user = Store.get(SYSTEM_SELF)
    if (user?.id) {
      await this.auditService.log({
        userId: user.id,
        tableInformation: 'MstUser',
        recordInformation: 'User logged out',
        actionInformation: 'LOGOUT'
      })
    }
    Store.set(SYSTEM_ACCESS_TOKEN, undefined as any)
    Store.set(SYSTEM_REFRESH_TOKEN, undefined as any)
    Store.set(SYSTEM_SELF, undefined as any)
    Store.set(SYSTEM_LOGIN_DATE, undefined as any)
    Store.set(POS_MANAGER, undefined as any)
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
      await this.verifySessionIntegrity(decoded)
    } catch (e: any) {
      // Clear invalid tokens
      await this.logout()
      throw new UnauthorizedException(e.message || 'Refresh token expired. Please log in again.')
    }

    // Re-fetch the user
    const user = await this.repository.findOneBy({ id: decoded.userId } as any)
    if (!user || user.status !== 'Active') {
      await this.logout()
      throw new UnauthorizedException('User account invalid or inactive.')
    }

    // Generate new tokens
    const fingerprint = await FingerprintService.generateFingerprint()
    const tokenPayload: TokenPayload = {
      userId: user.id,
      username: user.username,
      fingerprint,
      loginDate: decoded.loginDate || new Date().toISOString()
    }
    const newAccessToken = generateAccessToken(tokenPayload)
    const newRefreshToken = generateRefreshToken(tokenPayload)

    // Update store
    Store.set(SYSTEM_ACCESS_TOKEN, newAccessToken)
    Store.set(SYSTEM_REFRESH_TOKEN, newRefreshToken)
    Store.set(SYSTEM_SELF, user)
    Store.set(SYSTEM_LOGIN_DATE, tokenPayload.loginDate)

    const permissions = await this.getPermissions(user.id)

    // Sync POS store for next boot
    Store.set(POS_MANAGER, {
      initialize: true,
      activeUser: user,
      activePage: 'dashboard',
      activePermissions: permissions,
      loginDate: tokenPayload.loginDate
    })
    const { password: _pwd, ...safeUser } = user

    return {
      user: safeUser,
      tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      permissions: permissions as any,
      loginDate: tokenPayload.loginDate
    }
  }

  /**
   * Validates the stored access token (auth guard).
   */
  async validateAccessToken(): Promise<TokenPayload> {
    const accessToken = Store.get(SYSTEM_ACCESS_TOKEN)

    if (!accessToken) {
      throw new UnauthorizedException('No access token found. Please log in.')
    }

    try {
      const decoded = verifyToken(accessToken)
      await this.verifySessionIntegrity(decoded)
      return decoded
    } catch (e: any) {
      throw new UnauthorizedException(e.message || 'Access token expired or invalid.')
    }
  }

  /**
   * Fetches the permissions (forms) allowed for a specific user.
   * Permission Flattening: Ensure a flat array of unique strings.
   */
  async getPermissions(userId: number): Promise<string[]> {
    const permissions = await AppDataSource.getRepository(MstPermissionsEntity).find({
      where: { role: { userRoles: { user: { id: userId } } } },
      withDeleted: false,
      relations: ['accessRight']
    })
    
    const flatActions = permissions?.map((p) => p.action).filter(Boolean) || []
    return Array.from(new Set(flatActions)) as string[]
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

    user.permissions = await this.getPermissions(userId) || []

    return user
  }
}
