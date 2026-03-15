import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { SysSettingsEntity } from '../../../entities/utilities/SysSettings.entity'
import { BaseService } from '../../base.service'
import { CreateSysSettingsDto, UpdateSysSettingsDto } from './dto'

export interface ISysSettingsService {
  // Add specific SysSettings methods here later
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
}
