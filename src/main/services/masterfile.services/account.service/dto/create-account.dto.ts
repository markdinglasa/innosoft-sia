import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateAccountDto {
  @ApiProperty({ description: 'Unique account code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  code!: string

  @ApiProperty({ description: 'Account name' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({ description: 'Type of account (e.g., Asset, Liability)' })
  @IsString()
  @IsNotEmpty()
  type!: string
}
