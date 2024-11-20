export interface Manager {
  tenant: Tenant | null
  path: string | null
  isConnected: boolean
  initialize: boolean
  snackbar: boolean
}

export interface Tenant {
  TerminalId?: number
  BranchCode: string
  TenantCode: string
  SMClassCode: string
  StoreNumber: string
  SMSalesType: string
  POSMachineNumber: string
  POSSerialNumber: string
  SMCoinDirectory?: string
  Terminal: string
}
