import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength
} from 'class-validator'

export class CreateSupplierDto {
  @ApiProperty({ description: 'Name of the supplier' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
    name!: string

  @ApiProperty({ description: 'Physical address of the supplier' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string

  @ApiProperty({ description: 'Contact number' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  contactNumber!: string

  @ApiProperty({ description: 'Term ID' })
  @IsNumber()
  @IsNotEmpty()
  termId!: number

  @ApiProperty({ description: 'TIN number' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tin!: string

  @ApiProperty({ description: 'Account ID' })
  @IsNumber()
  @IsNotEmpty()
  accountId!: number
}
