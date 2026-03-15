import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'

export class CreateDebitCreditMemoLineDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  dcMemoId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  orderId?: number | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  accountId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  particulars?: string | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  debitAmount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  creditAmount!: number
}
