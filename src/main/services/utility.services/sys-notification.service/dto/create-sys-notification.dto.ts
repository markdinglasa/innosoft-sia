import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateSysNotificationDto {
  @ApiProperty({ description: 'Date and time of the notification' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  notificationDate!: Date

  @ApiProperty({ description: 'ID of the user to notify' })
  @IsNumber()
  @IsNotEmpty()
  userId!: number

  @ApiProperty({ description: 'Link related to the notification' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  link!: string

  @ApiProperty({ description: 'Notification description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  notificationDescription!: string

  @ApiProperty({ description: 'Type of notification (e.g., Info, Warning, Error)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  notificationType!: string

  @ApiProperty({ description: 'Whether the notification has been read' })
  @IsBoolean()
  @IsNotEmpty()
  isRead!: boolean
}
