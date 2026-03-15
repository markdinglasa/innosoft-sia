import { FindOneOptions } from 'typeorm'
import { MstPermissionsEntity } from '../../entities/masterfiles'
import { MstUserEntity } from '../../entities/masterfiles/MstUser.entity'
import { AppDataSource } from '../../typeORM/configurations'
import { BaseService, IBaseService } from '../base.service'

/**
 * Interface defining the Authentication and Authorization service.
 */
export interface IAuthService extends IBaseService<MstUserEntity> {
  login(userName: string, password: string): Promise<MstUserEntity | null>
  logout(userId: number): Promise<void>
  getPermissions(userId: number): Promise<MstPermissionsEntity[]>
  changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean>
  currentUser(userId:number):Promise<MstUserEntity | null>
}

/**
 * Service class handling user authentication and permissions.
 */
export class AuthService extends BaseService<MstUserEntity> implements IAuthService {
  constructor() {
    super(MstUserEntity)
  }

  /**
   * Verifies credentials and returns the user if successful.
   */
  async login(userName: string, password: string): Promise<MstUserEntity | null> {
    const options: FindOneOptions<MstUserEntity> = {
      where: {
        userName,
        password, // Note: In a production app, use Hashed passwords!
        isLocked: false
      }
    }
    return await this.repository.findOne(options)
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
   * Updates the user's password after verifying the old one.
   */
  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.get(userId)
    if (!user || user.password !== oldPassword) {
      return false
    }

    await this.update(userId, { password: newPassword } as any)
    return true
  }

  /**
   * Fetches the current user and its permissions.
   */
  async currentUser(userId:number):Promise<MstUserEntity | null>{
    const user = await this.get(userId)
    if (!user) throw new Error('User not found')

    const permissions = await this.getPermissions(userId)
    user.permissions = permissions ||[]

    return user
  }

  /**
   * Logs out the user.
   */
  async logout(userId: number): Promise<void> {
    const user = await this.get(userId)
    if (!user) throw new Error('User not found')

    await this.update(userId, { isLocked: true } as any)
  }
}
