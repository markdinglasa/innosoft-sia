import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateAccessRightDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  action!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  category!: string
}

export class UpdateAccessRightDto {
  @IsString()
  @MaxLength(255)
  action?: string

  @IsString()
  @MaxLength(255)
  category?: string
}
