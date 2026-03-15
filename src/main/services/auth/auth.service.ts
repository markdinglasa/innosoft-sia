import { FindOneOptions } from 'typeorm'
import { MstUserEntity } from '../../entities/masterfiles/MstUser.entity'
import { MstUserFormEntity } from '../../entities/masterfiles/MstUserForm.entity'
import { AppDataSource } from '../../typeORM/configurations'
import { BaseService, IBaseService } from '../base.service'

/**
 * Interface defining the Authentication and Authorization service.
 */
export interface IAuthService extends IBaseService<MstUserEntity> {
  login(userName: string, password: string): Promise<MstUserEntity | null>
  getPermissions(userId: number): Promise<MstUserFormEntity[]>
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
  async getPermissions(userId: number): Promise<MstUserFormEntity[]> {
    return await AppDataSource.getRepository(MstUserFormEntity).find({
      where: { userId }
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

  async currentUser(userId:number):Promise<MstUserEntity | null>{
    const user = await this.get(userId)
    if (!user) throw new Error('User not found')
    return user
  }
}
