import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateTableGroupDto {
  @ApiProperty({ description: 'Table group name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string

  @ApiProperty({ description: 'The branch ID this table group belongs to' })
  @IsNumber()
  @IsNotEmpty()
  branchId!: number
}
