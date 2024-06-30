import { DBConfig, Page, User } from '.'

export interface Manager {
  activeKey: string | null
  activeDBConfig: DBConfig | null
  activeLicense: string | null
  activePage: Page
  activeUser: User | null
  activeToken: string | null
}
