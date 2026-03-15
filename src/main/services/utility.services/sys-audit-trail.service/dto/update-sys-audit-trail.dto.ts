import { PartialType } from '@nestjs/swagger'
import { CreateSysAuditTrailDto } from './create-sys-audit-trail.dto'

export class UpdateSysAuditTrailDto extends PartialType(CreateSysAuditTrailDto) {}
