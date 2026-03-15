import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber
} from 'class-validator'

export class CreatePurchaseOrderLineDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  purchaseOrderId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  itemId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  unitId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cost!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number
}
