import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCollectionLineDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  collectionId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  payTypeId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  checkNumber?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  checkDate?: Date | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  checkBank?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  creditCardVerificationCode?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  creditCardNumber?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  creditCardType?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  creditCardBank?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  giftCertificateNumber?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  otherInformation?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  stockInId?: number | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  accountId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  creditCardReferenceNumber?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  creditCardHolderName?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  creditCardExpiry?: string | null
}
