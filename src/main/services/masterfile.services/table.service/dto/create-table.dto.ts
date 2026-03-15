import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateTableDto {
  @ApiProperty({ description: 'Unique code for the table' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tableCode!: string

  @ApiProperty({ description: 'ID of the table group' })
  @IsNumber()
  @IsNotEmpty()
  tableGroupId!: number

  @ApiProperty({ description: 'Is the table currently clean?' })
  @IsBoolean()
  @IsNotEmpty()
  isClean!: boolean

  @ApiPropertyOptional({ description: 'Top pixel location in floor plan' })
  @IsNumber()
  @IsOptional()
  topLocation?: number | null

  @ApiPropertyOptional({ description: 'Left pixel location in floor plan' })
  @IsNumber()
  @IsOptional()
  leftLocation?: number | null
}
