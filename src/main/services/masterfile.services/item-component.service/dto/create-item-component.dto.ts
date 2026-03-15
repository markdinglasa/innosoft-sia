import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateItemComponentDto {
  @ApiProperty({ description: 'ID of the parent item' })
  @IsNumber()
  @IsNotEmpty()
  itemId!: number

  @ApiProperty({ description: 'ID of the component item' })
  @IsNumber()
  @IsNotEmpty()
  componentItemId!: number

  @ApiProperty({ description: 'ID of the unit of measure' })
  @IsNumber()
  @IsNotEmpty()
  unitId!: number

  @ApiProperty({ description: 'Quantity of the component' })
  @IsNumber()
  @IsNotEmpty()
  quantity!: number

  @ApiProperty({ description: 'Cost of the component' })
  @IsNumber()
  @IsNotEmpty()
  cost!: number

  @ApiProperty({ description: 'Total amount (Quantity * Cost)' })
  @IsNumber()
  @IsNotEmpty()
  amount!: number

  @ApiProperty({ description: 'Is this component printed on receipts?' })
  @IsBoolean()
  @IsNotEmpty()
  isPrinted!: boolean
}
