export interface Manager {
  tenant: Tenant | null
  activeTenant: Tenants | null
  path: string | null
  isConnected: boolean
  initialize: boolean
  snackbar: boolean
  accumulatedTotal: number
  batchNo: number
}

export enum Tenants {
  DEFAULT = '',
  SM = 'SM',
  RLC = 'Robinsons',
  AYALA = 'Ayala',
  ALLIANCE = 'Alliance',
  MW = 'MegaWorld'
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
  BatchNo?: number
}
