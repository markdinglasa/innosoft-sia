import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber
} from 'class-validator'

export class CreatePaxTableDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalPax!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discountedPax!: number
}
