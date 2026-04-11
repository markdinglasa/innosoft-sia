import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateTerminalDto {
  @ApiProperty({ description: 'Terminal name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string

  @ApiProperty({ description: 'Is this the default terminal?' })
  @IsBoolean()
  @IsNotEmpty()
  isDefault!: boolean

  @ApiProperty({ description: 'The branch ID this terminal belongs to' })
  @IsNumber()
  @IsNotEmpty()
  branchId!: number
}

