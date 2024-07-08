
export interface Manager {
  tenant: Tenant | null;
  path: string | null;
}

export interface Tenant {
  BranchCode: string;
  TenantCode: string;
  SMClassCode?: string;
  StoreNumber?: string;
  SMSalesType: string;
  POSMachineNumber?: string;
  POSSerialNumber?: string;
  SMCoinDirectory?: string;
  Terminal: string;
}