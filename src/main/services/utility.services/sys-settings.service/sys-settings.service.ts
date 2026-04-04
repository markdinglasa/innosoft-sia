import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { SysSettingsEntity } from '../../../entities/utilities/SysSettings.entity'
import { BaseService } from '../../base.service'
import { CreateSysSettingsDto, UpdateSysSettingsDto } from './dto'
import { AppDataSource } from '../../../typeORM/configurations'
import { MstTerminalEntity } from '../../../entities/masterfiles/MstTerminal.entity'

export interface ISysSettingsService {
  getMergedSettings(terminalId: number): Promise<SysSettingsEntity>
}

export class SysSettingsService extends BaseService<SysSettingsEntity> implements ISysSettingsService {
  constructor() {
    super(SysSettingsEntity)
  }

  /**
   * Search fields for SysSettings keyword search.
   */
  protected get searchFields(): string[] {
    return ['tenant', 'orPrintTitle', 'salesReport', 'collectionReport', 'returnReport']
  }

  /**
   * Validates before creating new SysSettings.
   * Ensures terminal settings are unique (one per terminal).
   */
  protected async validateCreate(data: DeepPartial<SysSettingsEntity>): Promise<void> {
    const settingsDto = await transformAndValidate(CreateSysSettingsDto, data)

    const existingSettings = await this.repository.findOneBy({ terminalId: settingsDto.terminalId })
    if (existingSettings) {
      throw new BadRequestException(`Settings already exist for Terminal ID ${settingsDto.terminalId}.`)
    }
  }

  /**
   * Validates before updating existing SysSettings.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<SysSettingsEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Settings not found for update.')
    }

    const settingsDto = await transformAndValidate(UpdateSysSettingsDto, data)
    
    if (settingsDto.terminalId && settingsDto.terminalId !== currentEntity.terminalId) {
      const existingSettings = await this.repository.findOneBy({ terminalId: settingsDto.terminalId })
      if (existingSettings) {
        throw new BadRequestException(`Settings already exist for Terminal ID ${settingsDto.terminalId}.`)
      }
    }
  }

  /**
   * Validates before deleting SysSettings.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Settings not found for deletion.')
    }
  }

  /**
   * Fetches and merges Global, Branch, and Terminal settings.
   * Priority: Terminal > Branch > Global.
   */
  async getMergedSettings(terminalId: number): Promise<SysSettingsEntity> {
    // 1. Fetch Terminal Level
    const terminalSettings = await this.repository.findOneBy({ terminalId } as any)

    // 2. Fetch Branch Level
    const branchId = await this.getTerminalBranchId(terminalId)
    let branchSettings: SysSettingsEntity | null = null
    if (branchId) {
      // Convention: Negative terminalId represents Branch-level settings
      branchSettings = await this.repository.findOneBy({ terminalId: -branchId } as any)
    }

    // 3. Fetch Global Level
    const globalSettings = await this.repository.findOneBy({ terminalId: 0 } as any)

    // Merge logic: Terminal overrides Branch overrides Global
    // We start with a new entity and spread the layers
    const merged = new SysSettingsEntity()
    
    Object.assign(merged, globalSettings || {})
    Object.assign(merged, branchSettings || {})
    Object.assign(merged, terminalSettings || {})
    
    // Ensure final record has the correct terminalId
    merged.terminalId = terminalId
    
    return merged
  }

  /**
   * Helper to retrieve branchId for a given terminal.
   */
  private async getTerminalBranchId(terminalId: number): Promise<number | null> {
    const terminal = await AppDataSource.getRepository(MstTerminalEntity).findOneBy({ id: terminalId })
    return terminal ? terminal.branchId : null
  }
}
