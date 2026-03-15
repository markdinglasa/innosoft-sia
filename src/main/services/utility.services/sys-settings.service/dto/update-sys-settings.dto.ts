import { PartialType } from '@nestjs/swagger'
import { CreateSysSettingsDto } from './create-sys-settings.dto'

export class UpdateSysSettingsDto extends PartialType(CreateSysSettingsDto) {}
