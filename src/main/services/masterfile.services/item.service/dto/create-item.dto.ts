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

export class CreateItemDto {
  @ApiProperty({ description: 'Unique code for the item' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  itemCode!: string

  @ApiProperty({ description: 'Barcode for the item' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  barCode!: string

  @ApiProperty({ description: 'Full description of the item' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  itemDescription!: string

  @ApiProperty({ description: 'Alias or short name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  alias!: string

  @ApiProperty({ description: 'Generic name of the item' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  genericName!: string

  @ApiProperty({ description: 'Item category' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  category!: string

  @ApiProperty()
  @IsNumber()
  salesAccountId!: number

  @ApiProperty()
  @IsNumber()
  assetAccountId!: number

  @ApiProperty()
  @IsNumber()
  costAccountId!: number

  @ApiProperty()
  @IsNumber()
  inTaxId!: number

  @ApiProperty()
  @IsNumber()
  outTaxId!: number

  @ApiProperty()
  @IsNumber()
  unitId!: number

  @ApiProperty()
  @IsNumber()
  defaultSupplierId!: number

  @ApiProperty()
  @IsNumber()
  cost!: number

  @ApiProperty()
  @IsNumber()
  markUp!: number

  @ApiProperty()
  @IsNumber()
  price!: number

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  imagePath!: string

  @ApiProperty()
  @IsNumber()
  reorderQuantity!: number

  @ApiProperty()
  @IsNumber()
  onhandQuantity!: number

  @ApiProperty()
  @IsBoolean()
  isInventory!: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  expiryDate?: Date | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lotNumber?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  defaultKitchenReport?: string | null

  @ApiProperty()
  @IsBoolean()
  isPackage!: boolean
}
