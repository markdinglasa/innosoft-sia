import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateTermDto {
  @ApiProperty({ description: 'Term name (e.g., COD, 30 Days)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string

  @ApiProperty({ description: 'Number of days for the term' })
  @IsNumber()
  @IsNotEmpty()
  numberOfDays!: number

  @ApiProperty({ description: 'Is this the default term?' })
  @IsBoolean()
  @IsNotEmpty()
  isDefault!: boolean
}

