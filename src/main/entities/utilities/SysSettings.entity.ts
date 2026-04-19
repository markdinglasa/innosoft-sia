import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { POSEntity } from '../entity-names'
import { MstTerminalEntity } from '../masterfiles'

// per terminal settings
@Entity(POSEntity.SYS_SETTINGS)
export class SysSettingsEntity {
  constructor() {
    this.terminalId = 0
    this.isPartialPrint = 0
    this.isComponentEditing = 0
    this.isExcludeZeroAmountInOR = 0
    this.isPrintTransferTable = 0
    this.isTriggerQuantity = 0
    this.isHideSalesAmount = 0
    this.isChangePrice = 0
    this.isEditSellingPrice = 0
    this.isEditCost = 0
    this.isAuditLogs = 0
    this.isAutoServiceCharge = 0
    this.serviceChargeRate = 0
    this.periodId = 0
    this.customerId = ''
    this.discountId = 0
    this.supplierId = 0
    this.tableId = 0
    this.returnReport = ''
    this.isQuickInventory = 0
    this.isNegativeInventory = 0
    this.isDisableRealTimeInventory = 0
    this.serialNumber = ''
    this.permitNumber = ''
    this.accreditationNumber = ''
    this.tin = ''
    this.machineNumber = ''
    this.salesReport = ''
    this.collectionReport = ''
    this.isPromptLogin = 0
    this.isAliasPrinting = 0
    this.tenant = ''
    this.isSIVATAnalysis = 0
    this.isORVATAnalysis = 0
    this.isEjectDrawerOnPrint = 0
    this.isCustomerDisplay = 0
    this.orPrintTitle = ''
    this.isAutoPrintKitchenReport = 0
    this.isShowCollectedTab = 0
    this.restaurantView = ''
    this.receiptFooter = ''
    this.invoiceFooter = ''
    this.purchaseOrderApprovalThreshold = 0
  }

  @PrimaryColumn({ name: 'Id', type: 'int', nullable: false })
  id!: number

  @Column({ name: 'TerminalId', type: 'int', nullable: false })
  terminalId: number

  @Column({ name: 'IsPartialPrint', type: 'tinyint', nullable: false })
  isPartialPrint: number

  @Column({ name: 'IsComponentEditing', type: 'tinyint', nullable: false })
  isComponentEditing: number

  @Column({ name: 'IsExcludeZeroAmountInOR', type: 'tinyint', nullable: false })
  isExcludeZeroAmountInOR: number

  @Column({ name: 'IsPrintTransferTable', type: 'tinyint', nullable: false })
  isPrintTransferTable: number

  @Column({ name: 'IsTriggerQuantity', type: 'tinyint', nullable: false })
  isTriggerQuantity: number

  @Column({ name: 'IsHideSalesAmount', type: 'tinyint', nullable: false })
  isHideSalesAmount: number

  @Column({ name: 'IsChangePrice', type: 'tinyint', nullable: false })
  isChangePrice: number

  @Column({ name: 'IsEditSellingPrice', type: 'tinyint', nullable: false })
  isEditSellingPrice: number

  @Column({ name: 'IsEditCost', type: 'tinyint', nullable: false })
  isEditCost: number

  @Column({ name: 'IsAuditLogs', type: 'tinyint', nullable: false })
  isAuditLogs: number

  @Column({ name: 'IsAutoServiceCharge', type: 'tinyint', nullable: false })
  isAutoServiceCharge: number

  @Column({ name: 'ServiceChargeRate', type: 'decimal', nullable: false })
  serviceChargeRate: number

  @Column({ name: 'PeriodId', type: 'int', nullable: true })
  periodId: number

  @Column({ name: 'CustomerId', type: 'varchar', nullable: true })
  customerId: string

  @Column({ name: 'DiscountId', type: 'int', nullable: true })
  discountId: number

  @Column({ name: 'SupplierId', type: 'int', nullable: true })
  supplierId: number

  @Column({ name: 'TableId', type: 'int', nullable: true })
  tableId: number

  @Column({ name: 'ReturnReport', type: 'varchar', nullable: false })
  returnReport: string

  @Column({ name: 'IsQuickInventory', type: 'tinyint', nullable: false })
  isQuickInventory: number

  @Column({ name: 'IsNegativeInventory', type: 'tinyint', nullable: false })
  isNegativeInventory: number

  @Column({ name: 'IsDisableRealTimeInventory', type: 'tinyint', nullable: false })
  isDisableRealTimeInventory: number

  @Column({ name: 'SerialNumber', type: 'varchar', nullable: true })
  serialNumber: string

  @Column({ name: 'PermitNumber', type: 'varchar', nullable: true })
  permitNumber: string

  @Column({ name: 'AccreditationNumber', type: 'varchar', nullable: true })
  accreditationNumber: string

  @Column({ name: 'TIN', type: 'varchar', nullable: true })
  tin: string

  @Column({ name: 'MachineNumber', type: 'varchar', nullable: true })
  machineNumber: string

  @Column({ name: 'SalesReport', type: 'varchar', nullable: false })
  salesReport: string

  @Column({ name: 'CollectionReport', type: 'varchar', nullable: false })
  collectionReport: string

  @Column({ name: 'IsPromptLogin', type: 'tinyint', nullable: false })
  isPromptLogin: number

  @Column({ name: 'IsAliasPrinting', type: 'tinyint', nullable: false })
  isAliasPrinting: number

  @Column({ name: 'Tenant', type: 'varchar', nullable: false })
  tenant: string

  @Column({ name: 'IsSIVATAnalysis', type: 'tinyint', nullable: false })
  isSIVATAnalysis: number

  @Column({ name: 'IsORVATAnalysis', type: 'tinyint', nullable: false })
  isORVATAnalysis: number

  @Column({ name: 'IsEjectDrawerOnPrint', type: 'tinyint', nullable: false })
  isEjectDrawerOnPrint: number

  @Column({ name: 'IsCustomerDisplay', type: 'tinyint', nullable: false })
  isCustomerDisplay: number

  @Column({ name: 'ORPrintTitle', type: 'varchar', nullable: false })
  orPrintTitle: string

  @Column({ name: 'IsAutoPrintKitchenReport', type: 'tinyint', nullable: false })
  isAutoPrintKitchenReport: number

  @Column({ name: 'IsShowCollectedTab', type: 'tinyint', nullable: false })
  isShowCollectedTab: number

  @Column({ name: 'RestaurantView', type: 'varchar', nullable: false })
  restaurantView: string

  @Column({ name: 'ReceiptFooter', type: 'text', nullable: true })
  receiptFooter: string

  @Column({ name: 'InvoiceFooter', type: 'text', nullable: true })
  invoiceFooter: string

  @Column({
    name: 'PurchaseOrderApprovalThreshold',
    type: 'decimal',
    precision: 18,
    scale: 5,
    nullable: false,
    default: 0
  })
  purchaseOrderApprovalThreshold: number

  // FK Relations

  @ManyToOne(() => MstTerminalEntity, (terminal) => terminal.sysSettings)
  @JoinColumn({ name: 'TerminalId' })
  terminal?: MstTerminalEntity
}

