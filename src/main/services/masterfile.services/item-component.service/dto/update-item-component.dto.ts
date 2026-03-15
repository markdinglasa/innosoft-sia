import { PartialType } from '@nestjs/swagger'
import { CreateItemComponentDto } from './create-item-component.dto'

export class UpdateItemComponentDto extends PartialType(CreateItemComponentDto) {}
