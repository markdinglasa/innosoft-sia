import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreatePeriodDto {
  @ApiProperty({ description: 'Period name (e.g., Monthly, Quarterly)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string
}
