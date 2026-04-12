import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username!: string

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password!: string

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string

  @ApiProperty({ description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName!: string

  @ApiPropertyOptional({ description: 'User card number' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  userCardNumber?: string | null

  @ApiProperty({ description: 'User type', enum: ['Teller', 'Cashier', 'Administrator'] })
  @IsEnum(['Teller', 'Cashier', 'Administrator'])
  @IsNotEmpty()
  type!: string

  @ApiProperty({ description: 'User status', enum: ['Active', 'Inactive', 'Locked'] })
  @IsEnum(['Active', 'Inactive', 'Locked'])
  @IsNotEmpty()
  status!: string

  @ApiPropertyOptional({ description: 'Profile image path or base64' })
  @IsString()
  @IsOptional()
  image?: string | null
}
