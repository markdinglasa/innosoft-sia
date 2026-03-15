import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateSysUserTerminalDto {
  @ApiProperty({ description: 'ID of the user' })
  @IsNumber()
  @IsNotEmpty()
  userId!: number

  @ApiProperty({ description: 'ID of the terminal' })
  @IsNumber()
  @IsNotEmpty()
  terminalId!: number
}
