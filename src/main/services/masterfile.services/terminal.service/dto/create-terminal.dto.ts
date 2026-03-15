import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateTerminalDto {
  @ApiProperty({ description: 'Terminal name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  terminal!: string

  @ApiProperty({ description: 'Is this the default terminal?' })
  @IsBoolean()
  @IsNotEmpty()
  isDefault!: boolean
}
