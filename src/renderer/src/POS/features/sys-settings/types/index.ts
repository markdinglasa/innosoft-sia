export interface SysSettings {
  id: number
  terminalId: number
  isPartialPrint: number
  isComponentEditing: number
  isExcludeZeroAmountInOR: number
  isPrintTransferTable: number
  isTriggerQuantity: number
  isHideSalesAmount: number
  isChangePrice: number
  isEditSellingPrice: number
  isEditCost: number
  isAuditLogs: number
  isAutoServiceCharge: number
  serviceChargeRate: number
  periodId: number | null
  customerId: string | null
  discountId: number | null
  supplierId: number | null
  tableId: number | null
  returnReport: string
  isQuickInventory: number
  isNegativeInventory: number
  isDisableRealTimeInventory: number
  serialNumber: string | null
  permitNumber: string | null
  accreditationNumber: string | null
  tin: string | null
  machineNumber: string | null
  salesReport: string
  collectionReport: string
  isPromptLogin: number
  isAliasPrinting: number
  tenant: string
  isSIVATAnalysis: number
  isORVATAnalysis: number
  isEjectDrawerOnPrint: number
  isCustomerDisplay: number
  orPrintTitle: string
  isAutoPrintKitchenReport: number
  isShowCollectedTab: number
  restaurantView: string
  receiptFooter: string | null
  invoiceFooter: string | null
}

export interface SettingsState {
  settings: SysSettings | null
  isLoading: boolean
  error: string | null
  activeTerminalId: number | null
}
