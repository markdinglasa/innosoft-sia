import * as bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MstUserEntity } from '../../entities/masterfiles/MstUser.entity'
import Store from '../../store/Store'
import { AuthService } from './auth.service'

// Mock dependencies
vi.mock('../../store/Store')
vi.mock('bcrypt')
vi.mock('../../typeORM/configurations', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
    getMetadata: vi.fn().mockReturnValue({ tableName: 'MstUser' })
  }
}))
vi.mock('../connectivity.service', () => ({
  default: {
    isOnline: vi.fn().mockReturnValue(true)
  }
}))
vi.mock('../../common/utils/jwt.util', () => ({
  generateAccessToken: vi.fn().mockReturnValue('access'),
  generateRefreshToken: vi.fn().mockReturnValue('refresh'),
  verifyToken: vi.fn()
}))
vi.mock('../licensing/fingerprint.service', () => ({
  FingerprintService: {
    generateFingerprint: vi.fn().mockResolvedValue('consistent-hash')
  }
}))
vi.mock('../utility.services/sys-audit-trail.service/sys-audit-trail.service', () => ({
  SysAuditTrailService: class MockAuditService {
    log = vi.fn().mockResolvedValue(undefined)
  }
}))

describe('AuthService', () => {
  let authService: AuthService
  let mockRepo: any

  beforeEach(async () => {
    vi.clearAllMocks()
    mockRepo = {
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      find: vi.fn()
    }
    const { AppDataSource } = await import('../../typeORM/configurations')
    ;(AppDataSource.getRepository as any).mockReturnValue(mockRepo)

    // Reset Store mock
    const storeMap = new Map()
    ;(Store.get as any).mockImplementation((key: string) => storeMap.get(key))
    ;(Store.set as any).mockImplementation((key: string, val: any) => storeMap.set(key, val))

    authService = new AuthService()

    // Default query builder mock for checkIsDateClosed
    mockRepo.createQueryBuilder = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      getCount: vi.fn().mockResolvedValue(0)
    })
  })

  describe('login security features', () => {
    it('should throw generic error message for non-existent user', async () => {
      mockRepo.findOne.mockResolvedValue(null)
      await expect(authService.login('unknown', 'password')).rejects.toThrow(
        'Invalid username or password.'
      )
    })

    it('should throw generic error message for wrong password', async () => {
      const user = new MstUserEntity()
      user.username = 'test'
      user.password = 'hashed'
      user.status = 'Active'
      mockRepo.findOne.mockResolvedValue(user)
      ;(bcrypt.compare as any).mockResolvedValue(false)

      await expect(authService.login('test', 'wrong')).rejects.toThrow(
        'Invalid username or password.'
      )
    })

    it('should throw generic error message if user status is InActive', async () => {
      const user = new MstUserEntity()
      user.username = 'test'
      user.password = 'hashed'
      user.status = 'InActive'
      mockRepo.findOne.mockResolvedValue(user)
      ;(bcrypt.compare as any).mockResolvedValue(true)

      await expect(authService.login('test', 'password')).rejects.toThrow(
        'Invalid username or password.'
      )
    })

    it('should track failed attempts and lock account after 5 failures', async () => {
      mockRepo.findOne.mockResolvedValue(null) // Force user not found

      // 4 failures already
      Store.set('auth_failed_testuser' as any, 4)

      await expect(authService.login('testuser', 'password')).rejects.toThrow(
        'Invalid username or password.'
      )

      expect(Store.get('auth_failed_testuser' as any)).toBe(5)
      expect(Store.get('auth_lockout_testuser' as any)).toBeGreaterThan(Date.now())
    })

    it('should prevent login attempts during lockout period', async () => {
      const lockUntil = Date.now() + 15 * 60 * 1000
      Store.set('auth_lockout_testuser' as any, lockUntil)

      await expect(authService.login('testuser', 'password')).rejects.toThrow(/Temporarily Locked/)
    })

    it('should reset failed attempts on successful login', async () => {
      const user = new MstUserEntity()
      user.username = 'testuser'
      user.password = 'hashed'
      user.status = 'Active'
      mockRepo.findOne.mockResolvedValue(user)
      ;(bcrypt.compare as any).mockResolvedValue(true)

      Store.set('auth_failed_testuser' as any, 3)

      await authService.login('testuser', 'password')

      expect(Store.get('auth_failed_testuser' as any)).toBe(0)
    })
  })

  describe('business date selection', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    beforeEach(() => {
      const AppDataSource = (authService as any).AppDataSource || { getRepository: vi.fn() }
      vi.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepo)
    })

    it('should allow login with default date if not closed', async () => {
      const user = new MstUserEntity()
      user.username = 'testuser'
      user.password = 'hashed'
      user.status = 'Active'
      mockRepo.findOne.mockResolvedValue(user)
      ;(bcrypt.compare as any).mockResolvedValue(true)

      const result = await authService.login('testuser', 'password')
      expect(result.loginDate).toBeDefined()
    })

    it('should throw ClosedDateException if date is closed and no override provided', async () => {
      const user = new MstUserEntity()
      user.username = 'testuser'
      user.password = 'hashed'
      user.status = 'Active'
      mockRepo.findOne.mockResolvedValue(user)
      ;(bcrypt.compare as any).mockResolvedValue(true)

      // Mock date as closed
      mockRepo.createQueryBuilder().getCount.mockResolvedValue(1)

      await expect(authService.login('testuser', 'password', yesterday)).rejects.toThrow(
        /already closed/
      )
    })

    it('should allow login with closed date if valid manager override provided', async () => {
      const user = new MstUserEntity()
      user.id = 1
      user.username = 'testuser'
      user.password = 'hashed'
      user.status = 'Active'

      const manager = new MstUserEntity()
      manager.username = 'manager'
      manager.password = 'm_hashed'
      manager.status = 'Active'
      manager.userRoles = [{ role: { name: 'Manager' } }] as any

      // First call for logging in user, second for override manager
      mockRepo.findOne.mockResolvedValueOnce(user).mockResolvedValueOnce(manager)
      ;(bcrypt.compare as any).mockResolvedValue(true)

      // Mock date as closed
      mockRepo.createQueryBuilder().getCount.mockResolvedValue(1)

      const result = await authService.login('testuser', 'password', yesterday, {
        username: 'manager',
        password: 'm_password'
      })

      expect(result.loginDate).toBe(yesterday)
    })
  })
})

