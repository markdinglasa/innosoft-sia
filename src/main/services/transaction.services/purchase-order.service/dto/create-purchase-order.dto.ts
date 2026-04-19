import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
import { PurchaseOrderStatus } from '../../../../../shared/types/purchase-order.types'

export class CreatePurchaseOrderLineDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  itemId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  unitId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  unitCost!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  taxRate?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discountRate?: number
}

export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  branchId!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  periodId!: number

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  purchaseOrderDate!: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  purchaseOrderNumber!: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  supplierId!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedDeliveryDate?: Date | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string | null

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  preparedBy!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  checkedBy!: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  approvedBy!: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  requestedBy?: number | null

  @ApiProperty({ type: [CreatePurchaseOrderLineDto] })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderLineDto)
  lineItems!: CreatePurchaseOrderLineDto[]
}
