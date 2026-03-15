import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { SysAuditTrailEntity } from '../../../entities/utilities/SysAuditTrail.entity'
import { BaseService } from '../../base.service'
import { CreateSysAuditTrailDto, UpdateSysAuditTrailDto } from './dto'

export interface ISysAuditTrailService {
  // Add specific SysAuditTrail methods here later
}

export class SysAuditTrailService extends BaseService<SysAuditTrailEntity> implements ISysAuditTrailService {
  constructor() {
    super(SysAuditTrailEntity)
  }

  /**
   * Search fields for SysAuditTrail keyword search.
   */
  protected get searchFields(): string[] {
    return ['tableInformation', 'recordInformation', 'actionInformation']
  }

  /**
   * Validates before creating a new SysAuditTrail.
   */
  protected async validateCreate(data: DeepPartial<SysAuditTrailEntity>): Promise<void> {
    await transformAndValidate(CreateSysAuditTrailDto, data)
  }

  /**
   * Validates before updating an existing SysAuditTrail.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<SysAuditTrailEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Audit Trail entry not found for update.')
    }
    await transformAndValidate(UpdateSysAuditTrailDto, data)
  }

  /**
   * Validates before deleting a SysAuditTrail.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Audit Trail entry not found for deletion.')
    }
  }
}
