export interface Manager {
    tenant: Tenant | null;
    path: string | null;
    isConnected: boolean;
    initialize: boolean;
    snackbar: boolean;
  }

export interface Tenant {
  tenantId: string
  tenantName: string
}