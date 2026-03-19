import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateTaxDto {
  @ApiProperty({ description: 'Unique code for the tax' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string

  @ApiProperty({ description: 'Tax name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string

  @ApiProperty({ description: 'Tax rate' })
  @IsNumber()
  @IsNotEmpty()
  rate!: number

  @ApiProperty({ description: 'Account ID' })
  @IsNumber()
  @IsNotEmpty()
  accountId!: number
}
