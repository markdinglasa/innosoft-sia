import { ApiProperty } from '@nestjs/swagger'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateDebitCreditMemoDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  periodId!: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  dcMemoNumber!: string

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dcMemoDate!: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  particulars!: string

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
}
