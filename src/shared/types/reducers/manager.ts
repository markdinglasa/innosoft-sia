import type { MstUserEntity } from "src/main/entities"
import { DBConfig, Snackbar } from '@shared/types'

export interface Manager {
  activeWindow: string | null
  activeLicense: string | null
  activeLicenseStatus: string | null
  activeDBConfig: DBConfig | null
  activeKey: string | null
  activeSnackbar: Snackbar | null
}

export interface POSManager {
  initialize: boolean
  activePage: string | null
  activeUser: MstUserEntity | null
  activePermissions: string[]
  activeBranches: any[]
  loginDate: string | null
}