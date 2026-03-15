import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateRoleDto {
  @ApiProperty({ description: 'Unique code for the role' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  code!: string

  @ApiProperty({ description: 'Role name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string

  @ApiProperty({ description: 'Role description' })
  @IsString()
  @IsOptional()
  description?: string | null

  @ApiProperty({ description: 'Is this the default role?' })
  @IsBoolean()
  isDefault!: boolean
}
