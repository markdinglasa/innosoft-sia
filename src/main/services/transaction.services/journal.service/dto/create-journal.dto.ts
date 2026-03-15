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

export class CreateJournalDto {
  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  journalDate!: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  journalRefDocument!: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  accountId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  debitAmount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  creditAmount!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  orderId?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  stockInId?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  stockOutId?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  collectionId?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  dcMemoId?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  disbursementId?: number | null
}
