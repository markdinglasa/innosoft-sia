import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateStockInDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  periodId!: number

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  stockInDate!: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  stockInNumber!: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  supplierId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string | null

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isReturn!: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  collectionId?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  purchaseOrderId?: number | null

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
  orderId?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  branchId?: number | null
}
