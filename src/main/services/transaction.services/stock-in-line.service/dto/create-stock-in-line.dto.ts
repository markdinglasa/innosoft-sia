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

export class CreateStockInLineDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  stockInId!: number

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
  quantity!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cost!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lotNumber?: string | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  assetAccountId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  markUp?: number | null
}
