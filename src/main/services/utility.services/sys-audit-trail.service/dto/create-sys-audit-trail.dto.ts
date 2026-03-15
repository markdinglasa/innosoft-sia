import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateSysAuditTrailDto {
  @ApiProperty({ description: 'ID of the user who performed the action' })
  @IsNumber()
  @IsNotEmpty()
  userId!: number

  @ApiProperty({ description: 'Date and time of the audit entry' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  auditDate!: Date

  @ApiProperty({ description: 'Information about the table modified' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  tableInformation!: string

  @ApiProperty({ description: 'Information about the record modified' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  recordInformation!: string

  @ApiProperty({ description: 'Description of the action performed' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  actionInformation!: string
}
