import { PartialType } from '@nestjs/swagger'
import { CreateDiscountItemDto } from './create-discount-item.dto'

export class UpdateDiscountItemDto extends PartialType(CreateDiscountItemDto) {}
