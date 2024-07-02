import { Page, User } from '.'

export interface Manager {
  activePage: Page
  activeUser: User | null
  activeToken: string | null
}
