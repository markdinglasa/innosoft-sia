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

export class CreateStockOutDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  periodId!: number

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  stockOutDate!: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  stockOutNumber!: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  accountId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  preparedBy!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  checkedBy!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  approvedBy!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  branchId?: number | null
}
