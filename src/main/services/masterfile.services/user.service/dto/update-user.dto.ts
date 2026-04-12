import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  username?: string

  @IsString()
  @IsOptional()
  password?: string

  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string

  @IsString()
  @IsOptional()
  @MaxLength(255)
  fullName?: string

  @IsString()
  @IsOptional()
  @MaxLength(255)
  userCardNumber?: string | null

  @IsEnum(['Teller', 'Cashier', 'Administrator'])
  @IsOptional()
  type?: string

  @IsEnum(['Active', 'Inactive', 'Locked'])
  @IsOptional()
  status?: string

  @IsString()
  @IsOptional()
  image?: string | null
}
