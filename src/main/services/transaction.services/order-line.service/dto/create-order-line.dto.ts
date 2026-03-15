import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateOrderLineDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  itemId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  unitId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discountId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discountRate!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discountAmount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  netPrice!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  taxId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  taxRate!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  taxAmount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  salesAccountId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  assetAccountId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  costAccountId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  taxAccountId!: number

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  orderLineTimeStamp!: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  userId?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  preparation?: string | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price1!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price2!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price2LessTax!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  priceSplitPercentage!: number
}
