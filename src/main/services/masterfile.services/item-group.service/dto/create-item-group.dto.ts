import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateItemGroupDto {
  @ApiProperty({ description: 'Item group name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string

  @ApiPropertyOptional({ description: 'Path to group image' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  imagePatch?: string | null

  @ApiPropertyOptional({ description: 'Kitchen report identifier' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  kitchenReport?: string | null
}
