import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateSysSettingsDto {
  @ApiProperty({ description: 'Terminal ID associated with these settings' })
  @IsNumber()
  @IsNotEmpty()
  terminalId!: number

  @ApiProperty({ description: 'Is partial print enabled?' })
  @IsNumber()
  @IsNotEmpty()
  isPartialPrint!: number

  @ApiProperty({ description: 'Is component editing enabled?' })
  @IsNumber()
  @IsNotEmpty()
  isComponentEditing!: number

  @ApiProperty({ description: 'Is excluding zero amount in OR?' })
  @IsNumber()
  @IsNotEmpty()
  isExcludeZeroAmountInOR!: number

  @ApiProperty({ description: 'Is printing transfer table enabled?' })
  @IsNumber()
  @IsNotEmpty()
  isPrintTransferTable!: number

  @ApiProperty({ description: 'Is trigger quantity active?' })
  @IsNumber()
  @IsNotEmpty()
  isTriggerQuantity!: number

  @ApiProperty({ description: 'Is sales amount hidden?' })
  @IsNumber()
  @IsNotEmpty()
  isHideSalesAmount!: number

  @ApiProperty({ description: 'Is changing price allowed?' })
  @IsNumber()
  @IsNotEmpty()
  isChangePrice!: number

  @ApiProperty({ description: 'Is editing selling price allowed?' })
  @IsNumber()
  @IsNotEmpty()
  isEditSellingPrice!: number

  @ApiProperty({ description: 'Is editing cost allowed?' })
  @IsNumber()
  @IsNotEmpty()
  isEditCost!: number

  @ApiProperty({ description: 'Are audit logs active?' })
  @IsNumber()
  @IsNotEmpty()
  isAuditLogs!: number

  @ApiProperty({ description: 'Is auto service charge enabled?' })
  @IsNumber()
  @IsNotEmpty()
  isAutoServiceCharge!: number

  @ApiProperty({ description: 'Service charge rate' })
  @IsNumber()
  @IsNotEmpty()
  serviceChargeRate!: number

  @ApiPropertyOptional({ description: 'Period ID' })
  @IsNumber()
  @IsOptional()
  periodId?: number

  @ApiPropertyOptional({ description: 'Default Customer ID' })
  @IsString()
  @IsOptional()
  customerId?: string

  @ApiPropertyOptional({ description: 'Default Discount ID' })
  @IsNumber()
  @IsOptional()
  discountId?: number

  @ApiPropertyOptional({ description: 'Default Supplier ID' })
  @IsNumber()
  @IsOptional()
  supplierId?: number

  @ApiPropertyOptional({ description: 'Default Table ID' })
  @IsNumber()
  @IsOptional()
  tableId?: number

  @ApiProperty({ description: 'Return report name' })
  @IsString()
  @IsNotEmpty()
  returnReport!: string

  @ApiProperty({ description: 'Is quick inventory enabled?' })
  @IsNumber()
  @IsNotEmpty()
  isQuickInventory!: number

  @ApiProperty({ description: 'Is negative inventory allowed?' })
  @IsNumber()
  @IsNotEmpty()
  isNegativeInventory!: number

  @ApiProperty({ description: 'Is real time inventory disabled?' })
  @IsNumber()
  @IsNotEmpty()
  isDisableRealTimeInventory!: number

  @ApiPropertyOptional({ description: 'Serial Number' })
  @IsString()
  @IsOptional()
  serialNumber?: string

  @ApiPropertyOptional({ description: 'Permit Number' })
  @IsString()
  @IsOptional()
  permitNumber?: string

  @ApiPropertyOptional({ description: 'Accreditation Number' })
  @IsString()
  @IsOptional()
  accreditationNumber?: string

  @ApiPropertyOptional({ description: 'TIN' })
  @IsString()
  @IsOptional()
  tin?: string

  @ApiPropertyOptional({ description: 'Machine Number' })
  @IsString()
  @IsOptional()
  machineNumber?: string

  @ApiProperty({ description: 'Sales report name' })
  @IsString()
  @IsNotEmpty()
  salesReport!: string

  @ApiProperty({ description: 'Collection report name' })
  @IsString()
  @IsNotEmpty()
  collectionReport!: string

  @ApiProperty({ description: 'Is prompt login enabled?' })
  @IsNumber()
  @IsNotEmpty()
  isPromptLogin!: number

  @ApiProperty({ description: 'Is alias printing enabled?' })
  @IsNumber()
  @IsNotEmpty()
  isAliasPrinting!: number

  @ApiProperty({ description: 'Tenant name' })
  @IsString()
  @IsNotEmpty()
  tenant!: string

  @ApiProperty({ description: 'Is SI VAT analysis enabled?' })
  @IsNumber()
  @IsNotEmpty()
  isSIVATAnalysis!: number

  @ApiProperty({ description: 'Is OR VAT analysis enabled?' })
  @IsNumber()
  @IsNotEmpty()
  isORVATAnalysis!: number

  @ApiProperty({ description: 'Is eject drawer on print?' })
  @IsNumber()
  @IsNotEmpty()
  isEjectDrawerOnPrint!: number

  @ApiProperty({ description: 'Is customer display enabled?' })
  @IsNumber()
  @IsNotEmpty()
  isCustomerDisplay!: number

  @ApiProperty({ description: 'OR Print title' })
  @IsString()
  @IsNotEmpty()
  orPrintTitle!: string

  @ApiProperty({ description: 'Is auto print kitchen report?' })
  @IsNumber()
  @IsNotEmpty()
  isAutoPrintKitchenReport!: number

  @ApiProperty({ description: 'Is show collected tab?' })
  @IsNumber()
  @IsNotEmpty()
  isShowCollectedTab!: number

  @ApiProperty({ description: 'Restaurant view type' })
  @IsString()
  @IsNotEmpty()
  restaurantView!: string

  @ApiPropertyOptional({ description: 'Receipt footer text' })
  @IsString()
  @IsOptional()
  receiptFooter?: string

  @ApiPropertyOptional({ description: 'Invoice footer text' })
  @IsString()
  @IsOptional()
  invoiceFooter?: string
}
