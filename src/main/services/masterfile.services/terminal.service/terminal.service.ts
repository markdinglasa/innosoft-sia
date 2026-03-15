import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstTerminalEntity } from '../../../entities/masterfiles/MstTerminal.entity'
import { BaseService } from '../../base.service'
import { CreateTerminalDto, UpdateTerminalDto } from './dto'

export interface ITerminalService {
  // Add specific Terminal methods here later
}

export class TerminalService extends BaseService<MstTerminalEntity> implements ITerminalService {
  constructor() {
    super(MstTerminalEntity)
  }

  /**
   * Search fields for Terminal keyword search.
   */
  protected get searchFields(): string[] {
    return ['terminal']
  }

  /**
   * Validates before creating a new Terminal.
   * Ensures Terminal name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstTerminalEntity>): Promise<void> {
    const terminalDto = await transformAndValidate(CreateTerminalDto, data)

    const existingName = await this.repository.findOneBy({ terminal: terminalDto.terminal })
    if (existingName) {
      throw new BadRequestException(`Terminal '${terminalDto.terminal}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Terminal.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstTerminalEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Terminal not found for update.')
    }

    const terminalDto = await transformAndValidate(UpdateTerminalDto, data)
    if (terminalDto.terminal && terminalDto.terminal !== currentEntity.terminal) {
      const existingName = await this.repository.findOneBy({ terminal: terminalDto.terminal })
      if (existingName) {
        throw new BadRequestException(`Terminal '${terminalDto.terminal}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Terminal.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Terminal not found for deletion.')
    }
  }
}
