import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { MstTerminalEntity } from '../../../entities/masterfiles/MstTerminal.entity'
import { BaseService } from '../../base.service'
import { CreateTerminalDto, UpdateTerminalDto } from './dto'

export interface ITerminalService {
  activateTerminal(terminalId: number, fingerprint: string): Promise<void>
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
    return ['terminal']
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
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<MstTerminalEntity>): Promise<void> {
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
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Terminal not found for deletion.')
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
   * Binds a physical machine fingerprint to a terminal record.
   */
  async activateTerminal(terminalId: number, fingerprint: string): Promise<void> {
    const terminal = await this.get(terminalId)
    if (!terminal) {
      throw new BadRequestException('Terminal record not found.')
    }

    // Check if terminal is already bound to another machine
    if (terminal.physicalAddress && terminal.physicalAddress !== fingerprint) {
      throw new BadRequestException(
        `Unauthorized Move: Terminal '${terminal.name}' is already bound to another machine (${terminal.physicalAddress}).`
      )
    }

    // Bind fingerprint to this terminal
    await this.update(terminalId, { physicalAddress: fingerprint } as any)
  }
}
