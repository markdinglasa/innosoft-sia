import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BadRequestException } from '../../../common/exceptions'
import { transformAndValidate } from '../../../common/utils/validator'
import { SysNotificationEntity } from '../../../entities/utilities/SysNotification.entity'
import { BaseService } from '../../base.service'
import { CreateSysNotificationDto, UpdateSysNotificationDto } from './dto'

export interface ISysNotificationService {
  // Add specific SysNotification methods here later
}

export class SysNotificationService extends BaseService<SysNotificationEntity> implements ISysNotificationService {
  constructor() {
    super(SysNotificationEntity)
  }

  /**
   * Search fields for SysNotification keyword search.
   */
  protected get searchFields(): string[] {
    return ['notificationDescription', 'notificationType', 'link']
  }

  /**
   * Validates before creating a new SysNotification.
   */
  protected async validateCreate(data: DeepPartial<SysNotificationEntity>): Promise<void> {
    await transformAndValidate(CreateSysNotificationDto, data)
  }

  /**
   * Validates before updating an existing SysNotification.
   */
  protected async validateUpdate(id: any, data: QueryDeepPartialEntity<SysNotificationEntity>): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Notification not found for update.')
    }
    await transformAndValidate(UpdateSysNotificationDto, data)
  }

  /**
   * Validates before deleting a SysNotification.
   */
  protected async validateDelete(id: any): Promise<void> {
    const currentEntity = await this.get(id)
    if (!currentEntity) {
      throw new BadRequestException('Notification not found for deletion.')
    }
  }
}
