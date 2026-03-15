import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateItemPackageDto {
  @ApiProperty({ description: 'ID of the parent item' })
  @IsNumber()
  @IsNotEmpty()
  itemId!: number

  @ApiProperty({ description: 'ID of the package item' })
  @IsNumber()
  @IsNotEmpty()
  packageItemId!: number

  @ApiProperty({ description: 'ID of the unit of measure' })
  @IsNumber()
  @IsNotEmpty()
  unitId!: number

  @ApiProperty({ description: 'Quantity of the package item' })
  @IsNumber()
  @IsNotEmpty()
  quantity!: number

  @ApiProperty({ description: 'Is this an optional package item?' })
  @IsBoolean()
  @IsNotEmpty()
  isOptional!: boolean
}
