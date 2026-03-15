import { PartialType } from '@nestjs/swagger'
import { CreateSysUserTerminalDto } from './create-sys-user-terminal.dto'

export class UpdateSysUserTerminalDto extends PartialType(CreateSysUserTerminalDto) {}
