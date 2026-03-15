import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateItemPriceDto {
  @ApiProperty({ description: 'ID of the item' })
  @IsNumber()
  @IsNotEmpty()
  itemId!: number

  @ApiProperty({ description: 'Price description (e.g., Retail, Wholesale)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  priceDescription!: string

  @ApiProperty({ description: 'Unit price' })
  @IsNumber()
  @IsNotEmpty()
  price!: number

  @ApiProperty({ description: 'Quantity that triggers this price' })
  @IsNumber()
  @IsNotEmpty()
  triggerQuantity!: number
}
