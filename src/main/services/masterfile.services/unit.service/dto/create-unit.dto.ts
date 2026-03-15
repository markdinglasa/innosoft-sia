import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateUnitDto {
  @ApiProperty({ description: 'Unit name (e.g., PCS, KG)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unit!: string
}
