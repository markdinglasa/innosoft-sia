import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateBranchAccessDto {
  @ApiProperty({ description: 'ID of the branch' })
  @IsNumber()
  @IsNotEmpty()
  branchId!: number

  @ApiProperty({ description: 'ID of the user' })
  @IsNumber()
  @IsNotEmpty()
  userId!: number
}
