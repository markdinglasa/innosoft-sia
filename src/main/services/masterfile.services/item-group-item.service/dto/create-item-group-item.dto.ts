import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateItemGroupItemDto {
  @ApiProperty({ description: 'ID of the item' })
  @IsNumber()
  @IsNotEmpty()
  itemId!: number

  @ApiProperty({ description: 'ID of the item group' })
  @IsNumber()
  @IsNotEmpty()
  itemGroupId!: number
}
