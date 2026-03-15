import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SendEmailDto {
  @ApiProperty({ description: 'Recipient email address' })
  @IsEmail()
  @IsNotEmpty()
  to!: string

  @ApiProperty({ description: 'Email subject' })
  @IsString()
  @IsNotEmpty()
  subject!: string

  @ApiProperty({ description: 'Email body (HTML supported)' })
  @IsString()
  @IsNotEmpty()
  html!: string

  @ApiProperty({ description: 'Sender name or email', required: false })
  @IsString()
  @IsOptional()
  from?: string
}
