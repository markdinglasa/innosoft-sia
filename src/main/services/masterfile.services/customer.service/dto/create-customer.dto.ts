import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'

export class CreateCustomerDto {
  @ApiProperty({ description: 'Full name of the customer' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  customer!: string

  @ApiProperty({ description: 'Full address' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string

  @ApiProperty({ description: 'Contact person name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  contactPerson!: string

  @ApiProperty({ description: 'Contact phone/mobile number' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  contactNumber!: string

  @ApiProperty()
  @IsNumber()
  creditLimit!: number

  @ApiProperty()
  @IsNumber()
  termId!: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tin!: string

  @ApiProperty()
  @IsBoolean()
  withReward!: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  rewardNumber?: string | null

  @ApiProperty()
  @IsNumber()
  rewardConversion!: number

  @ApiProperty()
  @IsNumber()
  accountId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  defaultPriceDescription?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerCode?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessStyle?: string | null
}
