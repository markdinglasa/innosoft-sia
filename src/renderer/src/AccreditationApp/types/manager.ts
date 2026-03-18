export interface Manager {
  tenant: Tenant | null
  activeTenant: Tenants | null
  path: string | null
  isConnected: boolean
  initialize: boolean
  snackbar: boolean
  accumulatedTotal: number
  batchNo: number
  allianceCategory: string
  allianceReportType: string
  dates: string | null
}

export enum Tenants {
  DEFAULT = '',
  SM = 'SM',
  //RLC = 'Robinsons',
  //AYALA = 'Ayala',
  ALLIANCE = 'Alliance',
  MW = 'MegaWorld',
  E_JOURNAL = 'e-journal'
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
  POSKey?: string
}
