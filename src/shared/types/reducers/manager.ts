import { DBConfig, Snackbar } from '@shared/types'

export interface Manager {
  activeWindow: string | null
  activeLicense: string | null
  activeDBConfig: DBConfig | null
  activeKey: string | null
  activeSnackbar: Snackbar | null
}
