import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { SysUserTerminalEntity } from '../../../entities/utilities/SysUserTerminal.entity'
import { BaseService } from '../../base.service'
import { CreateSysUserTerminalDto, UpdateSysUserTerminalDto } from './dto'

export interface ISysUserTerminalService {
  // Add specific SysUserTerminal methods here later
}

export class SysUserTerminalService extends BaseService<SysUserTerminalEntity> implements ISysUserTerminalService {
  constructor() {
    super(SysUserTerminalEntity)
  }

  /**
   * Search fields for SysUserTerminal keyword search.
   */
  protected get searchFields(): string[] {
    return ['userId', 'terminalId']
  }

  /**
   * Validates before creating a new SysUserTerminal.
   * Ensures the user-terminal combination is unique.
   */
  protected async validateCreate(data: DeepPartial<SysUserTerminalEntity>): Promise<void> {
    const linkDto = await transformAndValidate(CreateSysUserTerminalDto, data)

    const existingLink = await this.repository.findOneBy({ 
      userId: linkDto.userId,
      terminalId: linkDto.terminalId
    })
    
    if (existingLink) {
      throw new BadRequestException('This user is already assigned to this terminal.')
    }
  }

  /**
   * Validates before updating an existing SysUserTerminal.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<SysUserTerminalEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('User Terminal assignment not found for update.')
    }

    const linkDto = await transformAndValidate(UpdateSysUserTerminalDto, data)
    
    const userId = linkDto.userId ?? currentEntity.userId
    const terminalId = linkDto.terminalId ?? currentEntity.terminalId

    if (userId !== currentEntity.userId || terminalId !== currentEntity.terminalId) {
      const existingLink = await this.repository.findOneBy({ 
        userId,
        terminalId
      })
      
      if (existingLink) {
        throw new BadRequestException('This user is already assigned to this terminal.')
      }
    }
  }

  /**
   * Validates before deleting a SysUserTerminal.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('User Terminal assignment not found for deletion.')
    }
  }
}
