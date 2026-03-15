import { PartialType } from '@nestjs/swagger'
import { CreatePayTypeDto } from './create-pay-type.dto'

export class UpdatePayTypeDto extends PartialType(CreatePayTypeDto) {}
