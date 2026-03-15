import { ApiProperty } from '@nestjs/swagger'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateStockCountDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  periodId!: number

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  stockCountDate!: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  stockCountNumber!: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  remarks!: string

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
