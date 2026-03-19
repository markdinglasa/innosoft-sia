import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateDiscountDto {
  @ApiProperty({ description: 'Discount name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name!: string

  @ApiProperty({ description: 'Discount rate' })
  @IsNumber()
  @IsNotEmpty()
  discountRate!: number

  @ApiProperty({ description: 'Is VAT exempt?' })
  @IsBoolean()
  @IsNotEmpty()
  isVatExempt!: boolean

  @ApiProperty({ description: 'Is date scheduled?' })
  @IsBoolean()
  @IsNotEmpty()
  isDateScheduled!: boolean

  @ApiProperty({ description: 'Date start' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dateStart!: Date

  @ApiProperty({ description: 'Date end' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dateEnd!: Date

  @ApiProperty({ description: 'Is time scheduled?' })
  @IsBoolean()
  @IsNotEmpty()
  isTimeScheduled!: boolean

  @ApiProperty({ description: 'Time start' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  timeStart!: Date

  @ApiProperty({ description: 'Time end' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  timeEnd!: Date

  @ApiProperty({ description: 'Is day scheduled?' })
  @IsBoolean()
  @IsNotEmpty()
  isDayScheduled!: boolean

  @ApiProperty({ description: 'Day Monday' })
  @IsBoolean()
  @IsNotEmpty()
  dayMon!: boolean

  @ApiProperty({ description: 'Day Tuesday' })
  @IsBoolean()
  @IsNotEmpty()
  dayTue!: boolean

  @ApiProperty({ description: 'Day Wednesday' })
  @IsBoolean()
  @IsNotEmpty()
  dayWed!: boolean

  @ApiProperty({ description: 'Day Thursday' })
  @IsBoolean()
  @IsNotEmpty()
  dayThu!: boolean

  @ApiProperty({ description: 'Day Friday' })
  @IsBoolean()
  @IsNotEmpty()
  dayFri!: boolean

  @ApiProperty({ description: 'Day Saturday' })
  @IsBoolean()
  @IsNotEmpty()
  daySat!: boolean

  @ApiProperty({ description: 'Day Sunday' })
  @IsBoolean()
  @IsNotEmpty()
  daySun!: boolean

  @ApiProperty({ description: 'Discount alias' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  discountAlias!: string
}
