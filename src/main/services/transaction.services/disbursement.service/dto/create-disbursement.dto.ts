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

export class CreateDisbursementDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  periodId!: number

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  disbursementDate!: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  disbursementNumber!: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  disbursementType!: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  accountId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  payTypeId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  terminalId!: number

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
  stockInId?: number | null

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
  amount1000?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount500?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount200?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount100?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount50?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount20?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount10?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount5?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount1?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount025?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount010?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount005?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount001?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  payee?: string | null
}
