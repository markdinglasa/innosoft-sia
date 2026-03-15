import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UploadFileDto {
  @ApiProperty({ description: 'The desired name of the file in storage' })
  @IsString()
  @IsNotEmpty()
  fileName!: string

  @ApiProperty({ description: 'The MIME type of the file', required: false })
  @IsString()
  @IsOptional()
  contentType?: string

  @ApiProperty({ description: 'Destination folder or path', required: false })
  @IsString()
  @IsOptional()
  folder?: string
}
