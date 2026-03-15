import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateDiscountItemDto {
  @ApiProperty({ description: 'ID of the discount' })
  @IsNumber()
  @IsNotEmpty()
  discountId!: number

  @ApiProperty({ description: 'ID of the item' })
  @IsNumber()
  @IsNotEmpty()
  itemId!: number

  @ApiProperty({ description: 'Is this an automatic discount?' })
  @IsBoolean()
  @IsNotEmpty()
  isAutoDiscount!: boolean
}
