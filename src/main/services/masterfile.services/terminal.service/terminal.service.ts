import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstTerminalEntity } from '../../../entities/masterfiles/MstTerminal.entity'
import { BaseService } from '../../base.service'
import { CreateTerminalDto, UpdateTerminalDto } from './dto'

export interface ITerminalService {
  activateTerminal(terminalId: number): Promise<void>
  getByBranch(branchId: number): Promise<MstTerminalEntity[]>
}

export class TerminalService extends BaseService<MstTerminalEntity> implements ITerminalService {
  constructor() {
    super(MstTerminalEntity)
  }

  /**
   * Search fields for Terminal keyword search.
   */
  protected get searchFields(): string[] {
    return ['name']
  }

  /**
   * Optional relations to include in list results.
   */
  protected get listRelations(): string[] {
    return ['branch']
  }

  /**
   * Validates before creating a new Terminal.
   * Ensures Terminal name is unique.
   */
  protected async validateCreate(data: DeepPartial<MstTerminalEntity>): Promise<void> {
    const terminalDto = await transformAndValidate(CreateTerminalDto, data)

    const existingName = await this.repository.findOneBy({ name: terminalDto.name })
    if (existingName) {
      throw new BadRequestException(`Terminal '${terminalDto.name}' already exists.`)
    }
  }

  /**
   * Validates before updating an existing Terminal.
   */
  protected async validateUpdate(
    id: any,
    data: QueryDeepPartialEntity<MstTerminalEntity>
  ): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Terminal not found for update.')
    }

    const terminalDto = await transformAndValidate(UpdateTerminalDto, data)
    if (terminalDto.name && terminalDto.name !== currentEntity.name) {
      const existingName = await this.repository.findOneBy({ name: terminalDto.name })
      if (existingName) {
        throw new BadRequestException(`Terminal '${terminalDto.name}' already exists.`)
      }
    }
  }

  /**
   * Validates before deleting a Terminal.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.repository.findOne({
      where: { id },
      relations: ['userTerminals']
    })
    if (!currentEntity) {
      throw new BadRequestException('Terminal not found for deletion.')
    }
    if (currentEntity.isDefault) {
      throw new BadRequestException('Cannot delete a default terminal')
    }
    if (currentEntity.userTerminals && currentEntity.userTerminals.length > 0) {
      throw new BadRequestException('Cannot delete a terminal that is already in use')
    }
  }

  /**
   * Fetches terminals for a specific branch.
   */
  async getByBranch(branchId: number): Promise<MstTerminalEntity[]> {
    return await this.repository.find({
      where: { branchId }
    })
  }

  /**
   * Sets a terminal as the active terminal for this device.
   * License handles device identity — no fingerprint binding needed.
   */
  async activateTerminal(terminalId: number): Promise<void> {
    const terminal = await this.get(terminalId)
    if (!terminal) {
      throw new BadRequestException('Terminal record not found.')
    }
  }
}

