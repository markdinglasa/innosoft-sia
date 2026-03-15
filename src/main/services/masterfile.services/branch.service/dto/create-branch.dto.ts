import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateBranchDto {
  @ApiProperty({ description: 'Branch name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name!: string

  @ApiProperty({ description: 'Branch address' })
  @IsString()
  @IsNotEmpty()
  address!: string

  @ApiProperty({ description: 'Branch description' })
  @IsString()
  @IsOptional()
  description?: string | null

  @ApiProperty({ description: 'Is this the default branch?' })
  @IsBoolean()
  isDefault!: boolean
}
