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

export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  periodId!: number

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  orderDate!: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  orderNumber!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  manualInvoiceNumber?: string | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  tableId?: number | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  customerId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  accountId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  termId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discountId?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  seniorCitizenId?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seniorCitizenName?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  seniorCitizenAge?: number | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderAgent!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  terminalId!: number

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
  isReturn?: number | null

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isCancelled!: boolean

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  paidAmount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  creditAmount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  debitAmount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  balanceAmount!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  pax?: number | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tableStatus!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  childName?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tinNumber?: string | null

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isBilledOut!: boolean
}
