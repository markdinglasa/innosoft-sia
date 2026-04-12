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
  @IsOptional()
  @MaxLength(255)
  barCode?: string

  @ApiProperty({ description: 'Full name of the item' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string

  @ApiProperty({ description: 'Full description of the item' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string

  @ApiProperty({ description: 'Generic name of the item' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  genericName?: string

  @ApiProperty({ description: 'Item category' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  category?: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  salesAccountId?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  assetAccountId?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  costAccountId?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  inTaxId?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  outTaxId?: number

  @ApiProperty()
  @IsNumber()
  unitId!: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  defaultSupplierId?: number

  @ApiProperty()
  @IsNumber()
  cost!: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  markUp?: number

  @ApiProperty()
  @IsNumber()
  price!: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  imagePath?: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  reorderQuantity?: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  onhandQuantity?: number

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isInventory?: boolean

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
  @IsOptional()
  isPackage?: boolean
}
