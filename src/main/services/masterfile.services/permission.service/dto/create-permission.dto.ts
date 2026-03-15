import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreatePermissionDto {
  @ApiProperty({ description: 'ID of the access right' })
  @IsNumber()
  @IsNotEmpty()
  accessRightId!: number

  @ApiProperty({ description: 'ID of the role' })
  @IsNumber()
  @IsNotEmpty()
  roleId!: number
}
