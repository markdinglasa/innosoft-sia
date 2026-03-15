import { PartialType } from '@nestjs/swagger'
import { CreateSysNotificationDto } from './create-sys-notification.dto'

export class UpdateSysNotificationDto extends PartialType(CreateSysNotificationDto) {}
