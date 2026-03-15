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

export class CreateCollectionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  periodId!: number

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  collectionDate!: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  collectionNumber!: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  terminalId!: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  manualORNumber!: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  customerId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  orderId?: number | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  salesBalanceAmount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tenderAmount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  changeAmount!: number

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
  isReturned?: number | null

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isCancelled!: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  postCode?: string | null
}
