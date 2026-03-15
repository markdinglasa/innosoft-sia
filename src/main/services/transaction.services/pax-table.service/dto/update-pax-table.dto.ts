import { PartialType } from '@nestjs/swagger'
import { CreatePaxTableDto } from './create-pax-table.dto'

export class UpdatePaxTableDto extends PartialType(CreatePaxTableDto) {}
