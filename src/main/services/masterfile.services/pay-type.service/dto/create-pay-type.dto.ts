import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreatePayTypeDto {
  @ApiProperty({ description: 'Payment type name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  payType!: string

  @ApiPropertyOptional({ description: 'Account ID' })
  @IsNumber()
  @IsOptional()
  accountId?: number | null

  @ApiPropertyOptional({ description: 'Sort number' })
  @IsNumber()
  @IsOptional()
  sortNumber?: number | null
}
