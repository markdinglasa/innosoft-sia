import { MutationResponse } from "@shared/types/pagination"
import * as bcrypt from 'bcrypt'
import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstBranchAccessEntity } from '../../../entities/masterfiles/MstBranchAccess.entity'
import { MstUserEntity } from '../../../entities/masterfiles/MstUser.entity'
import { ParentChildService } from '../../parent-child.service'
import { CreateUserDto, UpdateUserDto } from './dto'

export interface IUserService {
  // Add specific User methods here later
  registerUser(data: CreateUserDto): Promise<MutationResponse<MstUserEntity>>
}

export class UserService extends ParentChildService<MstUserEntity> implements IUserService {
  constructor() {
    super(MstUserEntity, [
      { entity: MstBranchAccessEntity, foreignKey: 'userId', payloadKey: 'branchAccesses' }
    ])
  }



   async registerUser(data: CreateUserDto): Promise<MutationResponse<MstUserEntity>> {
    // encrypt password
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await this.create({...data, password: hashedPassword})

  return user  
  }

  /**
   * Search fields for User keyword search.
   */
  protected get searchFields(): string[] {
    return ['userName', 'fullName', 'email', 'userCardNumber']
  }

  /**
   * Validates before creating a new User.
   * Ensures UserName and Email are unique.
   */
  protected async validateCreate(data: DeepPartial<MstUserEntity>): Promise<void> {
    const userDto = await transformAndValidate(CreateUserDto, data)

    const existingUser = await this.repository.findOneBy({ username: userDto.username })
    if (existingUser) {
      throw new BadRequestException(`Username '${userDto.username}' already exists.`)
    }

    const existingEmail = await this.repository.findOneBy({ email: userDto.email })
    if (existingEmail) {
      throw new BadRequestException(`Email '${userDto.email}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing User.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstUserEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('User not found for update.')
    }

    const userDto = await transformAndValidate(UpdateUserDto, data)
    
    if (userDto.username && userDto.username !== currentEntity.username) {
      const existingUser = await this.repository.findOneBy({ username: userDto.username })
      if (existingUser) {
        throw new BadRequestException(`Username '${userDto.username}' already exists.`)
      }
    }

    if (userDto.email && userDto.email !== currentEntity.email) {
      const existingEmail = await this.repository.findOneBy({ email: userDto.email })
      if (existingEmail) {
        throw new BadRequestException(`Email '${userDto.email}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a User.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('User not found for deletion.')
    }
  }
}
